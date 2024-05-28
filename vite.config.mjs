import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const { NODE_ENV } = process.env;

export default defineConfig({
  root: resolve('./src'),
  base:
    NODE_ENV === 'production'
      ? 'https://hitmands.github.io/connect4/'
      : undefined,
  build: {
    outDir: resolve('./dist'),
  },
  plugins: [react()],
});
