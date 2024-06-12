import { join } from 'path';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import configForNostagik from '@nostagik/core/src/tailwind-preset';

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [configForNostagik],
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
