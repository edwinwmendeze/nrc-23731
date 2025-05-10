// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import icon from 'astro-icon';
import  node  from '@astrojs/node';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://edwinmendeze.github.io',

  // Base URL para GitHub Pages (sin /grupo-a)
  base: '/',

    output: "server",
  adapter: node({
    mode: "standalone"
  }),
//   output: "static",

  integrations: [
    sitemap(),
    compress(),
    icon({
      include: {
        tabler: ['*'],  // Incluir todos los íconos de Tabler
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    // Configuración de optimización de imágenes usando astro:assets
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  compressHTML: true,

  build: {
    inlineStylesheets: 'auto'
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },

//   adapter: vercel(),
});