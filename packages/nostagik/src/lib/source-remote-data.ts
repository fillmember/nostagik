import { createHash } from 'crypto';
import {
  outputFile,
  outputJSONSync,
  pathExistsSync,
  readJSONSync,
} from 'fs-extra';
import * as path from 'path';

import type {
  BlockObjectResponse,
  BookmarkBlockObjectResponse,
  CalloutBlockObjectResponse,
  ImageBlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import sizeOf from 'image-size';
import { getLinkPreview } from 'link-preview-js';
import { get, merge, omit } from 'lodash';
import slugify from 'slugify';
import {
  GetNotionPageOption,
  LocalBlockType,
  LocalCoverField,
  LocalIconField,
  LocalImageBlockType,
  NotionPageData,
  TitleProperty,
} from './types';
import {
  getCachePath,
  getImagePublicPath,
  getImageStoragePath,
  groupItemsBy,
  richTextToString,
  uniqueId,
} from './utils';
import { getNotionClient } from './client';

export async function fetchNotionPage(
  option: GetNotionPageOption,
  pageId: string
) {
  const pageData = await fetchPageData(option, pageId);
  if (pageData.isCache === false) {
    await fetchBlocks(option, pageId);
    return pageData;
  }
  return pageData;
}

async function fetchPageData(
  option: GetNotionPageOption,
  id: string
): Promise<{ isCache: boolean; data: Omit<NotionPageData, 'blocks'> }> {
  const STR_CACHE_TIMESTAMP_KEY = 'cache_timestamp';
  const res = (await getNotionClient(option).pages.retrieve({
    page_id: id,
  })) as PageObjectResponse;
  // check cache
  const filePath = getCachePath(option, id, 'page.json');
  const localData = readJSONSync(filePath, { throws: false });
  const cacheTimestamp = get(localData, STR_CACHE_TIMESTAMP_KEY, null);
  // compare timestamp
  const shouldUpdate =
    !cacheTimestamp ||
    new Date(cacheTimestamp) < new Date(res.last_edited_time);
  if (shouldUpdate) {
    const title = richTextToString(
      (res.properties['title'] as TitleProperty).title
    );
    const data = {
      cover: await downloadCover(option, id, res.cover),
      icon: await downloadIcon(option, id, res.icon),
      title,
      slug: slugify(title, { lower: true, strict: true }),
      [STR_CACHE_TIMESTAMP_KEY]: new Date().toISOString(),
    };
    outputJSONSync(filePath, data);
    return { data, isCache: false };
  }
  return { data: localData, isCache: true };
}

async function downloadImage(
  option: GetNotionPageOption,
  pageId: string,
  externalUrl: string
): Promise<Omit<LocalImageBlockType['image'], 'caption'>> {
  externalUrl;
  const urlWithoutQuery = externalUrl.split('?')[0];
  const parsed = path.parse(urlWithoutQuery);
  const hasher = createHash('md5');
  const hash = hasher.update(externalUrl).digest('hex');
  const fileName = `${parsed.name}-${hash}${parsed.ext}`;
  const filePath = getImageStoragePath(option, pageId, fileName);
  if (!pathExistsSync(filePath)) {
    const res = await fetch(externalUrl);
    const buffer = Buffer.from(await res.arrayBuffer());
    await outputFile(filePath, buffer);
  }
  // get dimensions
  const dimensions = sizeOf(filePath);
  // return
  return {
    type: 'image',
    url: getImagePublicPath(option, pageId, fileName),
    dimensions,
  };
}

async function downloadIcon(
  option: GetNotionPageOption,
  pageId: string,
  icon: PageObjectResponse['icon']
): Promise<LocalIconField> {
  if (!icon) return null;
  switch (icon.type) {
    case 'emoji':
      return { type: icon.type, emoji: icon.emoji };
    case 'file':
      return await downloadImage(option, pageId, icon.file.url);
    case 'external':
      return await downloadImage(option, pageId, icon.external.url);
  }
}

async function downloadCover(
  option: GetNotionPageOption,
  pageId: string,
  cover: PageObjectResponse['cover']
): Promise<LocalCoverField> {
  if (!cover) return null;
  switch (cover.type) {
    case 'file':
      return await downloadImage(option, pageId, cover.file.url);
    case 'external':
      return await downloadImage(option, pageId, cover.external.url);
  }
}

async function enrichBlocks(
  option: GetNotionPageOption,
  pageId: string,
  blocks: BlockObjectResponse[]
): Promise<LocalBlockType[]> {
  const expandBlock = async (block_id: string) => {
    return await enrichBlocks(
      option,
      pageId,
      await getNotionClient(option)
        .blocks.children.list({ block_id })
        .then((res) => res.results as BlockObjectResponse[])
    );
  };
  const promisedBlocks = blocks
    .map(
      (block) =>
        // remote some keys we are not using
        omit(block, [
          'object',
          'created_time',
          'created_by',
          'last_edited_time',
          'last_edited_by',
          'archived',
          'in_trash',
          'parent',
        ]) as LocalBlockType
    )
    .map(async (block) => {
      // expand blocks with children
      // handle child database and page separatedly
      if (
        block.has_children &&
        block.type !== 'child_database' &&
        block.type !== 'child_page'
      ) {
        return {
          ...block,
          children: await expandBlock(block.id),
        };
      }
      // transform blocks by type
      switch (block.type) {
        case 'callout': {
          const calloutBlock = block as CalloutBlockObjectResponse;
          return merge(block, {
            callout: {
              icon: await downloadIcon(
                option,
                pageId,
                calloutBlock.callout.icon
              ),
            },
          });
        }
        case 'bookmark': {
          const bookmarkBlock = block as BookmarkBlockObjectResponse;
          return merge(block, {
            bookmark: {
              preview: await getLinkPreview(bookmarkBlock.bookmark.url),
            },
          });
        }
        case 'image': {
          let newImageData: LocalImageBlockType['image'];
          const imageBlock = block as ImageBlockObjectResponse;
          const { caption } = imageBlock.image;
          switch (imageBlock.image.type) {
            case 'file':
              newImageData = {
                caption,
                ...(await downloadImage(
                  option,
                  pageId,
                  imageBlock.image.file.url
                )),
              };
              break;
            case 'external':
              newImageData = {
                caption,
                ...(await downloadImage(
                  option,
                  pageId,
                  imageBlock.image.external.url
                )),
              };
              break;
          }
          if (newImageData) {
            return {
              ...block,
              image: newImageData,
            } as LocalImageBlockType;
          } else {
            return imageBlock as ImageBlockObjectResponse;
          }
        }
        case 'child_page': {
          const {
            data: { slug, icon },
          } = await fetchNotionPage(option, block.id);
          return { ...block, slug, icon };
        }
        case 'child_database': {
          // TODO: handle child_database
          return block;
        }
        default:
          return block;
      }
    });
  const resolvedBlocks = await Promise.all(promisedBlocks);
  const groupedBlocks = groupListItems(resolvedBlocks);
  return groupedBlocks;
}

function groupListItems(blocks: LocalBlockType[]) {
  let result;
  const listId = uniqueId('list-');
  result = groupItemsBy(
    blocks,
    ({ type }) => type === 'bulleted_list_item',
    (children) => ({
      id: listId.next().value,
      type: 'bulleted_list',
      children,
    })
  );
  result = groupItemsBy(
    result,
    ({ type }: any) => type === 'numbered_list_item',
    (children) => ({
      id: listId.next().value,
      type: 'numbered_list',
      children,
    })
  );
  result = groupItemsBy(
    result,
    ({ type }: any) => type === 'to_do',
    (children) => ({ id: listId.next().value, type: 'to_do_list', children })
  );
  return result;
}

async function fetchBlocks(option: GetNotionPageOption, id: string) {
  const filePath = getCachePath(option, id, 'blocks.json');
  const rawBlocks = await getNotionClient(option)
    .blocks.children.list({ block_id: id })
    .then((res) => res.results as BlockObjectResponse[]);
  const data = await enrichBlocks(option, id, rawBlocks);
  outputJSONSync(filePath, data);
  return { data, isCache: false };
}
