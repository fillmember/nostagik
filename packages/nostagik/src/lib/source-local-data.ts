import 'server-only';

import { readJSONSync, readJsonSync } from 'fs-extra';

import { relative, join, dirname } from 'path';
import { glob } from 'fast-glob';

export async function listStoredPages() {
  const pageFiles = await glob('./src/data/**/page.json');
  const pairs = pageFiles.map((file) => {
    const hash = dirname(relative('./src/data', file)).replace(/-/g, '');
    const data = readJsonSync(file);
    return { hash, slug: data.slug };
  });
  const flat = pairs.flatMap(({ hash, slug }) => [hash, slug]);
  return { pairs, flat };
}

export async function readPageData(id: string) {
  const page = readJSONSync(join('src/data', id, 'page.json'));
  const blocks = readJSONSync(join('src/data', id, 'blocks.json'));
  return {
    ...page,
    blocks,
  };
}
