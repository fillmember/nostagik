import 'server-only';

import { glob } from 'fast-glob';
import { readJsonSync } from 'fs-extra';
import { dirname, relative } from 'path';
import { resolveGetNotionPageOption } from './getNotionPage';
import { GetNotionPageOption, RecursivePartial } from './types';
import { getPageJsonPath } from './utils';

export async function listStoredPages(
  option: RecursivePartial<GetNotionPageOption> = {}
) {
  const _option = resolveGetNotionPageOption(option);
  const pageFiles = await glob(getPageJsonPath(_option, '**'));
  const pairs = pageFiles.map((file) => {
    const hash = dirname(relative('./src/data', file)).replace(/-/g, '');
    const data = readJsonSync(file);
    return { hash, slug: data.slug };
  });
  const flat = pairs.flatMap(({ hash, slug }) => [hash, slug]);
  return { pairs, flat };
}
