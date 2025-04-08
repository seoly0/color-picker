import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'color-picker',
      fileName: 'index',
      formats: ['es', 'umd']
    }
  }
})