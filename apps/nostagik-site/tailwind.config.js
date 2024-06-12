import { join } from 'path';
import configForNostagik from '@nostagik/core/src/tailwind-preset';

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [configForNostagik],
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    join(
      __dirname,
      '../../packages/nostagik/src/**/*!(*.stories|*.spec).{tsx,ts,jsx,js,html}'
    ),
    join(
      __dirname,
      '../../packages/react/src/**/*!(*.stories|*.spec).{tsx,ts,jsx,js,html}'
    ),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
