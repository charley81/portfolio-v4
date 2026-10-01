// @ts-check
import sitemap from '@astrojs/sitemap';
import stylex from '@stylexjs/unplugin';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://christopherharley.com',
  integrations: [sitemap()],
  vite: {
    plugins: [
      stylex.vite({
        devMode: 'full',
        useCSSLayers: true,
      }),
    ],
  },
});
