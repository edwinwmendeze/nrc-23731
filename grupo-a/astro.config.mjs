// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://edwinmendeze.github.io',
  base: '/nrc-23731',  // Base URL para GitHub Pages (sin /grupo-a)
  output: "server",
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
});
