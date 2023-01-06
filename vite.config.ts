import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from '@samrum/vite-plugin-web-extension'
import { getCsp } from './internals/getCsp'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: `build-vite/`,
  },
  resolve: {
    alias: {
      locales: path.resolve(__dirname, './src/locales'),
      utils: path.resolve(__dirname, './src/utils'),
      app: path.resolve(__dirname, './src/app'),
      types: path.resolve(__dirname, './src/types'),
      styles: path.resolve(__dirname, './src/styles'),
      config: path.resolve(__dirname, './src/config'),
      store: path.resolve(__dirname, './src/store'),
      vendors: path.resolve(__dirname, './src/vendors'),
    },
  },
  plugins: [
    react(),
    webExtension({
      manifest: {
        name: '__MSG_appName__',
        short_name: '__MSG_appName__',
        description: '__MSG_appDescription__',
        manifest_version: 2,
        version: '0.0.1',
        default_locale: 'en',
        icons: {
          '16': './logo512.png',
          '19': './logo512.png',
          '32': './logo512.png',
          '38': './logo512.png',
          '64': './logo512.png',
          '128': './logo512.png',
          '512': './logo512.png',
        },
        browser_action: {
          default_icon: {
            '16': './logo512.png',
            '19': './logo512.png',
            '32': './logo512.png',
            '38': './logo512.png',
            '64': './logo512.png',
            '128': './logo512.png',
            '512': './logo512.png',
          },
          default_title: 'Oasis Wallet',
          default_popup: './extension/src/popup.html',
        },
        permissions: ['storage', 'notifications', 'activeTab'],
        content_security_policy: getCsp({ isExtension: true }),
        background: {
          page: './extension/src/background.html',
          persistent: true,
        },
        web_accessible_resources: ['./public/oasis-xu-frame.html'],
        externally_connectable: { ids: [] },
      },
    }),
  ],
})
