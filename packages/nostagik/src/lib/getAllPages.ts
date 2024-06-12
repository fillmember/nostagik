import { glob } from 'fast-glob';
import { NostagikConfig } from './config';
import { getNotionPage, resolveGetNotionPageOption } from './getNotionPage';
import { GetNotionPageOption, RecursivePartial } from './types';
import { getPageJsonPath } from './utils';
import { dirname, relative } from 'path';
import { readJsonSync } from 'fs-extra';

export async function getAllPages(
  config: NostagikConfig,
  option: RecursivePartial<GetNotionPageOption> = {}
): Promise<{
  pairs: {
    id: string;
    slug: string;
  }[];
  flat: string[];
}> {
  // configurations
  const _option = resolveGetNotionPageOption(option);
  const pagesFromConfig = config.pages || [];
  // pull specified pages from remote first
  await Promise.all(pagesFromConfig.map(({ id }) => getNotionPage(id, option)));
  // check stored pages (should have rather complete, newly pulled data)
  const pageFiles = await glob(getPageJsonPath(_option, '**'));
  const pairs = pageFiles.map((file) => {
    const id = dirname(relative(_option.paths.data, file)).replace(/-/g, '');
    const data = readJsonSync(file);
    return { id, slug: data.slug };
  });
  const flat = pairs.flatMap(({ id, slug }) => [id, slug]);
  return { pairs, flat };
}
