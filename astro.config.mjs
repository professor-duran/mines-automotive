import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://professor-duran.github.io',
  base: '/mines-automotive',
  trailingSlash: 'always',
  integrations: [
    sitemap(),
    icon({ include: { lucide: ['*'] } })
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    format: 'directory'
  }
});
