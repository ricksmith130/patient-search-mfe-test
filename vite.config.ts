import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
  server: { port: 5174, cors: true, host: true, hmr: false },
  preview: { port: 5174, cors: true },
  plugins: [
    react(),
    federation({
      name: 'patient-search-mfe',
      filename: 'remoteEntry.js',
      dts: false,
      remotes: {
        'ncrs-host': {
          type: 'module',
          name: 'ncrs-host',
          // entry: 'https://dyaczj620kiv8.cloudfront.net/eph/25/remoteEntry.js',
          entry: 'http://localhost:5173/remoteEntry.js',
          entryGlobalName: 'ncrs_host',
          shareScope: 'default'
        },
      },
      exposes: {
        './App': './src/App.tsx',
      },
      shareScope: 'default',
      shared: {
        "react": { singleton: true, requiredVersion: "^19.1.1" },
        "react-dom": { singleton: true, requiredVersion: "^19.1.1" },
        "redux": { singleton: true, requiredVersion: "^5.0.1" },
        "react-redux": { singleton: true, requiredVersion: "^9.2.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^7.13.0" },
        "nhsuk-react-components": { singleton: true, requiredVersion: "6.0.0-beta.4" },
        "nhsuk-react-components-extensions": { singleton: true, requiredVersion: "^2.3.5-beta" },
      }
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
