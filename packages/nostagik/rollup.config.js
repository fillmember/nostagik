const { withNx } = require('@nx/rollup/with-nx');

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: '../../dist/packages/core',
    tsConfig: './tsconfig.lib.json',
    compiler: 'tsc',
    format: ['esm', 'cjs'],
    assets: [{ input: '.', output: '.', glob: '*.md' }],
    external: ['@notionhq/client', 'clsx'],
    generateExportsField: true,
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    // e.g.
    // output: { sourcemap: true },
  }
);
