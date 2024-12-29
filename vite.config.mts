import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import macrosPlugin from 'vite-plugin-babel-macros';
import EnvironmentPlugin from 'vite-plugin-environment';
import MinifyCssModule from 'vite-minify-css-module/vite';
import { compression } from 'vite-plugin-compression2';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  base: '/',
  plugins: [
    react({
      include: /\.(js|ts|jsx|tsx)$/,
      exclude: ['node_modules'],
      babel: {
        plugins: ['styled-components'],
        babelrc: false,
        configFile: false,
      },
    }),
    svgr({
      svgrOptions: {
        exportType: 'named',
      },
    }),
    viteTsconfigPaths(),
    macrosPlugin(),
    EnvironmentPlugin('all', { prefix: 'REACT_APP_' }),
    ViteMinifyPlugin({}),
    compression(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
    MinifyCssModule(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  optimizeDeps: {
    include: ['react'],
  },
  define: {
    global: 'window',
    'process.env': process.env,
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  build: {
    outDir: 'build',
    commonjsOptions: {
      strictRequires: true,
      include: [/node_modules/],
    },
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ['antd'],
        },
      },
    },
  },
  resolve: {
    alias: [
      // { './runtimeConfig': './runtimeConfig.browser' },
      // { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  esbuild: {
    sourcemap: false,
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3002,
    warmup: {
      clientFiles: ['./src/**/*.{js,jsx,ts,tsx}'],
    },
  },
  preview: {
    port: 3002,
  },
});
