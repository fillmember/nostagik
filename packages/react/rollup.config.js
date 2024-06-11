const { withNx } = require('@nx/rollup/with-nx');

module.exports = withNx(
  {
    main: './src/index.tsx',
    outputPath: '../../dist/packages/react',
    tsConfig: './tsconfig.lib.json',
    compiler: 'tsc',
    external: ['react', 'react-dom', 'react/jsx-runtime', 'clsx'],
    format: ['cjs', 'esm'],
    assets: [{ input: '.', output: '.', glob: 'README.md' }],
    outputFileName: 'index',
    generateExportsField: true,
    skipTypeField: false,
    skipTypeCheck: false,
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
  }
);
