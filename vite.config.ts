import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import linaria from '@linaria/vite';
import wasm from "vite-plugin-wasm";
import resolve from "@rollup/plugin-node-resolve";

export default defineConfig({
  plugins: [
    react(),
    linaria({
      include: ['**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
    }),
    {
      ...resolve({
        preferBuiltins: false,
        browser: true,
      }),
      enforce: 'pre',
      apply: 'build',
    },
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
    target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15']
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
})
