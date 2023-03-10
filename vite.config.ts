import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import linaria from '@linaria/vite';
import inject from '@rollup/plugin-inject';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  plugins: [
    react(),
    linaria({
      include: ['**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
    })
  ],
  define: {
    global: 'window'
  },
  optimizeDeps: {
    esbuildOptions: {
      mainFields: ['module', 'main'],
      resolveExtensions: ['.web.js', '.js', '.ts'],
      plugins: [
        NodeModulesPolyfillPlugin(),
        NodeGlobalsPolyfillPlugin({
          process: false,
          buffer: true
        })
      ]
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        inject({ Buffer: ['buffer', 'Buffer'] })
      ]
    },
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
})
