import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig( {
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve( __dirname, 'src' ) },
    ],
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'color-picker',
      fileName: 'index',
      formats: [ 'es', 'umd' ],
    },
  },
} )
