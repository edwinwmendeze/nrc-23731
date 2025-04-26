/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    globals: true,
    environment: 'node',
    reporters: ['default', 'json'],
    outputFile: 'vitest.output.json'
  }
});