import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import linaria from '@linaria/vite';

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
    global: 'window',
  },
  optimizeDeps: {
    esbuildOptions: {
      mainFields: ['module', 'main'],
      resolveExtensions: ['.web.js', '.js', '.ts'],
    },
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
})
