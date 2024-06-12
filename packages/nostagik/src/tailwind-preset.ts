import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './node_modules/@nostagik/core/config.cjs.js',
    './node_modules/@nostagik/react/page.esm.js',
  ],
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        '.nostagik-default-page-layout': {
          display: 'grid',
          gridColumnGap: '32px',
          gridTemplateColumns: '1fr min(80ch, calc(100% - 64px)) 1fr',
        },
      });
    }),
  ],
};

export default config;
