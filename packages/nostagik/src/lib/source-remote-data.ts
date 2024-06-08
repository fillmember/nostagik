import 'server-only';

import {
  outputFile,
  outputJSONSync,
  pathExistsSync,
  readJSONSync,
} from 'fs-extra';
import * as path from 'path';

import { Client } from '@notionhq/client';
import type {
  BlockObjectResponse,
  ImageBlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import sizeOf from 'image-size';
import { get, omit } from 'lodash';
import slugify from 'slugify';
import { LocalBlockType, LocalImageBlockType, TitleProperty } from './types';
import {
  getCachePath,
  getImagePublicPath,
  getImageStoragePath,
  groupItemsBy,
  richTextToString,
  uniqueId,
} from './utils';

export async function fetchNotionPage(pageId: string) {
  const pageData = await fetchPageData(pageId);
  if (pageData.isCache === false) {
    await fetchBlocks(pageId);
    return pageData;
  }
  return pageData;
}

async function fetchPageData(id: string) {
  const STR_CACHE_TIMESTAMP_KEY = 'cache_timestamp';
  const res = (await notion.pages.retrieve({
    page_id: id,
  })) as PageObjectResponse;
  // check cache
  const filePath = getCachePath(id, 'page.json');
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
      cover: await downloadCover(id, res.cover),
      icon: await downloadIcon(id, res.icon),
      title,
      slug: slugify(title, { lower: true, strict: true }),
      [STR_CACHE_TIMESTAMP_KEY]: new Date().toISOString(),
    };

    outputJSONSync(filePath, data);
    return { data, isCache: false };
  }
  return { data: localData, isCache: true };
}

const notion = new Client({
  auth: process.env['NOTION_TOKEN'],
});

async function downloadImage(
  pageId: string,
  externalUrl: string
): Promise<Omit<LocalImageBlockType['image'], 'caption'>> {
  externalUrl;
  const urlWithoutQuery = externalUrl.split('?')[0];
  const fileName = path.basename(urlWithoutQuery);
  const filePath = getImageStoragePath(pageId, fileName);
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
    url: getImagePublicPath(pageId, fileName),
    dimensions,
  };
}

async function downloadIcon(pageId: string, icon: PageObjectResponse['icon']) {
  if (!icon) return null;
  switch (icon.type) {
    case 'emoji':
      return { type: icon.type, value: icon.emoji };
    case 'file':
      return await downloadImage(pageId, icon.file.url);
    case 'external':
      return await downloadImage(pageId, icon.external.url);
  }
}

async function downloadCover(
  pageId: string,
  cover: PageObjectResponse['cover']
) {
  if (!cover) return null;
  switch (cover.type) {
    case 'file':
      return await downloadImage(pageId, cover.file.url);
    case 'external':
      return await downloadImage(pageId, cover.external.url);
  }
}

async function enrichBlocks(
  pageId: string,
  blocks: BlockObjectResponse[]
): Promise<LocalBlockType[]> {
  const expandBlock = async (block_id: string) => {
    return await enrichBlocks(
      pageId,
      await notion.blocks.children
        .list({ block_id })
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
        case 'image': {
          let newImageData: LocalImageBlockType['image'];
          const imageBlock = block as ImageBlockObjectResponse;
          const { caption } = imageBlock.image;
          switch (imageBlock.image.type) {
            case 'file':
              newImageData = {
                caption,
                ...(await downloadImage(pageId, imageBlock.image.file.url)),
              };
              break;
            case 'external':
              newImageData = {
                caption,
                ...(await downloadImage(pageId, imageBlock.image.external.url)),
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
            data: { slug },
          } = await fetchNotionPage(block.id);
          return { ...block, slug };
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
    ({ type }) => type === 'numbered_list_item',
    (children) => ({
      id: listId.next().value,
      type: 'numbered_list',
      children,
    })
  );
  result = groupItemsBy(
    result,
    ({ type }) => type === 'to_do',
    (children) => ({ id: listId.next().value, type: 'to_do_list', children })
  );
  return result;
}

async function fetchBlocks(id: string) {
  const filePath = getCachePath(id, 'blocks.json');
  const rawBlocks = await notion.blocks.children
    .list({ block_id: id })
    .then((res) => res.results as BlockObjectResponse[]);
  const data = await enrichBlocks(id, rawBlocks);
  outputJSONSync(filePath, data);
  return { data, isCache: false };
}
