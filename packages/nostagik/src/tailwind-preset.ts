import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './node_modules/@nostagik/core/config.cjs.js',
    './node_modules/@nostagik/react/page.esm.js',
  ],
  plugins: [
    plugin(({ addComponents, addBase }) => {
      addComponents({
        '.nostagik-default-page-layout': {
          display: 'grid',
          gridColumnGap: '32px',
          gridTemplateColumns: '1fr min(80ch, calc(100% - 64px)) 1fr',
        },
      });
      addBase({
        ':root': {
          '--sh-class': '#2d5e9d',
          '--sh-identifier': '#354150',
          '--sh-sign': '#8996a3',
          '--sh-property': '#0550ae',
          '--sh-entity': '#249a97',
          '--sh-jsxliterals': '#6266d1',
          '--sh-string': '#00a99a',
          '--sh-keyword': '#f47067',
          '--sh-comment': '#a19595',
        },
      });
    }),
  ],
};

export default config;
