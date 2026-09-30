// @ts-check
import stylex from '@stylexjs/unplugin';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://christopherharley.com',
  vite: {
    plugins: [
      stylex.vite({
        devMode: 'full',
        useCSSLayers: true,
      }),
    ],
  },
});
