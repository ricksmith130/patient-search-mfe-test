import { defineConfig, Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Custom plugin to resolve ncrs-host imports to mocks
function ncrsHostMocksPlugin(): Plugin {
  const mocksDir = path.resolve(__dirname, './__mocks__/ncrs-host')

  return {
    name: 'ncrs-host-mocks',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'ncrs-host' || source.startsWith('ncrs-host/')) {
        const moduleName = source === 'ncrs-host' ? 'index' : source.replace('ncrs-host/', '')
        const mockPath = path.join(mocksDir, `${moduleName}.ts`)

        if (fs.existsSync(mockPath)) {
          return mockPath
        }
        // Return a stub for missing mocks
        return path.join(mocksDir, '_stub.ts')
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [
    ncrsHostMocksPlugin(),
    react(),
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setupTests.ts',
    css: true,
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/main.tsx',
        'src/App.tsx',
        'src/test/**',
        '__mocks__/**',
        '__federation-tests__/**',
      ],
      thresholds: {
        branches: 75,
        functions: 75,
        lines: 75,
        statements: 75,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './src/test'),
      '@components': path.resolve(__dirname, './src/components'),
      '@views': path.resolve(__dirname, './src/views'),
      '@redux': path.resolve(__dirname, './src/redux'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'test'),
  },
})
