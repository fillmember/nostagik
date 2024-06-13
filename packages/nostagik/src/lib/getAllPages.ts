import { glob } from 'fast-glob';
import { readJsonSync } from 'fs-extra';
import { dirname, relative } from 'path';
import { NostagikConfig, NostagikConfigPageRecord } from './config';
import { getNotionPage, resolveGetNotionPageOption } from './getNotionPage';
import { GetNotionPageOption, RecursivePartial } from './types';
import { getPageJsonPath } from './utils';
import { merge } from 'lodash';

export async function getAllPages(
  config: NostagikConfig,
  option: RecursivePartial<GetNotionPageOption> = {}
): Promise<
  ({
    id: string;
    slug: string;
  } & Partial<NostagikConfigPageRecord>)[]
> {
  // configurations
  const _option = resolveGetNotionPageOption(option);
  const pagesFromConfig = config.pages || [];
  // pull specified pages from remote first
  await Promise.all(pagesFromConfig.map(({ id }) => getNotionPage(id, option)));
  // check stored pages (should have rather complete, newly pulled data)
  const pageFiles = await glob(getPageJsonPath(_option, '**'));
  const pages = pageFiles.map((file) => {
    const id = dirname(relative(_option.paths.data, file)).replace(/-/g, '');
    const dataFromConfig = pagesFromConfig.find((item) => item.id === id);
    const data = readJsonSync(file);
    return merge({ id, slug: data.slug }, dataFromConfig);
  });
  return pages;
}
