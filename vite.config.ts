import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import linaria from '@linaria/vite';
import wasm from "vite-plugin-wasm";
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

export default defineConfig({
  plugins: [
    react(),
    linaria({
      include: ['**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
    }),
    wasm(),
    nodePolyfills()
  ],
  optimizeDeps: {
    esbuildOptions: {
      mainFields: ['module', 'main'],
      resolveExtensions: ['.web.js', '.js', '.ts'],
    },
    exclude: ["@automerge/automerge-wasm"]
  },
  build: {
    target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15'],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
})
