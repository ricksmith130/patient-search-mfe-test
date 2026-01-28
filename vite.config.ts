import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  server: { port: 5174, cors: true, host: true },
  preview: { port: 5174, cors: true },
  plugins: [
    react(),
    federation({
      name: 'patient-search-mfe',
      filename: 'remoteEntry.js',
      remotes: {
        'ncrs-host': 'http://localhost:5173/nationalcarerecordsservice/static/remoteEntry.js',
      },
      exposes: {
        './App': './src/App.tsx',
      },
      shared: ['react', 'react-dom', 'redux', 'react-redux', 'react-router-dom', 'nhsuk-react-components', 'nhsuk-react-components-extensions']
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
