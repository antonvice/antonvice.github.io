// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://antonvice.github.io',

  redirects: {
    '/posts/[...slug]': '/blog/[...slug]'
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});
