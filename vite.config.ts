import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import linaria from '@linaria/vite';
import inject from '@rollup/plugin-inject';
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [
    react(),
    linaria({
      include: ['**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
    }),
    // topLevelAwait(),
    wasm()
  ],
  optimizeDeps: {
    esbuildOptions: {
      mainFields: ['module', 'main'],
      resolveExtensions: ['.web.js', '.js', '.ts'],
      inject: ['./esbuild.inject.js']
    },
    exclude: ["@automerge/automerge-wasm"]
  },
  build: {
    rollupOptions: {
      plugins: [
        inject({ Buffer: ['buffer', 'Buffer'] })
      ]
    },
    target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15']
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
})
