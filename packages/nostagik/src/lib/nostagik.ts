import { join } from 'path';
import { readJSON } from 'fs-extra';
import { fetchNotionPage } from './source-remote-data';
import { NotionPageData } from './types';

export const getNotionPage = async (
  id: string
): Promise<NotionPageData | null> => {
  // source remote data
  try {
    await fetchNotionPage(id);
  } catch (error) {
    console.error(`Error occured when fetching data from Notion API: `, error);
    return null;
  }
  // get data from local
  try {
    const page = await readJSON(join('src/data', id, 'page.json'));
    const blocks = await readJSON(join('src/data', id, 'blocks.json'));
    return { ...page, blocks };
  } catch (error) {
    console.error(`Error occured when reading local JSON files: `, error);
    return null;
  }
};

export * from './source-remote-data';
export * from './source-local-data';
export * from './render';
export * from './types';
