import { existsSync, readJSON } from 'fs-extra';
import { merge } from 'lodash';
import { fetchNotionPage } from './source-remote-data';
import { GetNotionPageOption, NotionPageData, RecursivePartial } from './types';
import { getBlocksJsonPath, getPageJsonPath } from './utils';

export const defaultGetNotionPageOption: GetNotionPageOption = {
  localDataMinimumValidTime: 600,
  paths: {
    data: './src/data/',
    image: './public/cached-images',
    imagePublicPath: './cached-images',
  },
  notionClientAuthToken: null,
};

export function resolveGetNotionPageOption(
  option: RecursivePartial<GetNotionPageOption>
): GetNotionPageOption {
  return merge({}, defaultGetNotionPageOption, option) as GetNotionPageOption;
}

export const getNotionPage = async (
  id: string,
  option: RecursivePartial<GetNotionPageOption> = {}
): Promise<NotionPageData | null> => {
  const _option = resolveGetNotionPageOption(option);
  const pathPageJson = getPageJsonPath(_option, id);
  //
  let page: any;
  let cacheAge = Infinity;
  // check if data exist locally
  if (existsSync(pathPageJson)) {
    page = await readJSON(pathPageJson);
    cacheAge =
      new Date().getTime() - new Date(page.cache_timestamp as string).getTime();
  }
  if (cacheAge > _option.localDataMinimumValidTime * 1000) {
    // source remote data
    try {
      await fetchNotionPage(_option, id);
    } catch (error) {
      console.error(
        `Error occured when fetching data from Notion API: `,
        error
      );
      return null;
    }
  }
  // get data from local
  try {
    page = await readJSON(pathPageJson);
    const blocks = await readJSON(getBlocksJsonPath(_option, id));
    return { ...page, blocks };
  } catch (error) {
    console.error(`Error occured when reading local JSON files: `, error);
    return null;
  }
};
