import { defineConfig, Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const hostDir = path.resolve(__dirname, '../../ncrs/spa')

// Mapping from ncrs-host module names to host source file paths (from federation exposes)
const federationExposes: Record<string, string> = {
  'findTabsConstants': 'src/js/core/constants/internals/FindTabs',
  'useAppState': 'src/js/core/hooks/CommonHooks',
  'FormIdConstants': 'src/js/core/constants/idattributes/FormIdConstants',
  'IdConstants': 'src/js/core/constants/idattributes/IdConstants',
  'FocusHelpers': 'src/js/core/helpers/FocusHelpers',
  'NhsNumberValidator': 'src/js/core/validators/NhsNumberValidator',
  'FormErrorSummary': 'src/js/presentation/wrappers/FormErrorSummary',
  'CommonStrings': 'src/js/core/constants/uistrings/CommonStrings',
  'ModalActionCreator': 'src/js/redux/actions/ModalActionCreator',
  'NhsNumberQueryActionCreator': 'src/js/redux/actions/patientsearch/NhsNumberQueryActionCreator',
  'AccessibilityHelpers': 'src/js/core/helpers/AccessibilityHelpers',
  'DateConstants': 'src/js/core/constants/DateConstants',
  'ActionTypes': 'src/js/core/constants/internals/ActionTypes',
  'Routing': 'src/js/core/constants/internals/Routing',
  'store': 'src/js/appStore',
  'locationChange': 'src/js/redux/reducers/locationChange',
  'SampleEmptyStates': 'src/js/test/sampleEmptyStates',
  'NavigationActions': 'src/js/redux/actions/NavigationActions',
  'TabActionCreator': 'src/js/redux/actions/TabActionCreator',
  'UrlConfig': 'src/js/config/Config',
  'HttpClient': 'src/js/redux/actions/HttpClient',
  'SingleDateInputRegExps': 'src/js/core/constants/SingleDateInputRegExps',
  'GenericStrings': 'src/js/core/constants/uistrings/pdsedit/GenericStrings',
  'Vocabulary': 'src/js/core/constants/vocabulary/Vocabulary',
  'CommonValidators': 'src/js/core/validators/CommonValidators',
  'ValidationRegExps': 'src/js/core/constants/ValidationRegExps',
  'FindPatientStrings': 'src/js/core/constants/uistrings/patientsearch/FindPatientStrings',
  'ValidationMessageStrings': 'src/js/core/constants/uistrings/ValidationMessageStrings',
  'RbacConstants': 'src/js/core/constants/roles/RbacConstants',
  'Modals': 'src/js/core/constants/internals/Modals',
  'PatientDashboardStrings': 'src/js/core/constants/uistrings/patientdetails/PatientDashboardStrings',
  'PatientSearchResultsStrings': 'src/js/core/constants/uistrings/patientsearch/PatientSearchResultsStrings',
  'NavigationWarningStrings': 'src/js/core/constants/uistrings/modals/NavigationWarningStrings',
  'QueryTypes': 'src/js/core/constants/internals/QueryTypes',
  'GenericHelpers': 'src/js/core/helpers/GenericHelpers',
  'GenderFormatter': 'src/js/presentation/formatters/GenderFormatter',
  'DateHelper': 'src/js/core/helpers/DateHelper',
  'SingleDateInput': 'src/js/presentation/components/SingleDateInput',
  'DateFormatter': 'src/js/presentation/formatters/DateFormatter',
  'BasicTypes': 'src/js/core/types/BasicTypes',
  'AppStateTypes': 'src/js/core/types/AppStateTypes',
  'DateInputSwitcher': 'src/js/presentation/components/DateInputSwitcher',
  'PostCodeFormatter': 'src/js/presentation/formatters/PostCodeFormatter',
  'OSPlacesAddressFinder': 'src/js/presentation/components/OSPlacesAddressFinder',
  'DateRangeInput': 'src/js/presentation/components/DateRangeInput',
}

// Resolves ncrs-host/* imports: explicit mock → real host source → stub fallback
function ncrsHostMocksPlugin(): Plugin {
  const mocksDir = path.resolve(__dirname, './__mocks__/ncrs-host')

  return {
    name: 'ncrs-host-mocks',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'ncrs-host' || source.startsWith('ncrs-host/')) {
        const moduleName = source === 'ncrs-host' ? 'index' : source.replace('ncrs-host/', '')

        // 1. Check for explicit mock file
        const mockPath = path.join(mocksDir, `${moduleName}.ts`)
        if (fs.existsSync(mockPath)) {
          return mockPath
        }
        const mockPathTsx = path.join(mocksDir, `${moduleName}.tsx`)
        if (fs.existsSync(mockPathTsx)) {
          return mockPathTsx
        }

        // 2. Check for real host source via federation exposes
        const hostRelPath = federationExposes[moduleName]
        if (hostRelPath) {
          for (const ext of ['.ts', '.tsx', '.d.ts']) {
            const fullPath = path.join(hostDir, hostRelPath + ext)
            if (fs.existsSync(fullPath)) {
              return fullPath
            }
          }
        }

        // 3. Fallback stub
        return path.join(mocksDir, '_stub.ts')
      }
      return null
    },
  }
}

// Resolves host path aliases and shared dependencies for files within the host source tree
function ncrsHostAliasPlugin(): Plugin {
  const mfeNodeModules = path.resolve(__dirname, 'node_modules')

  const aliases: Record<string, string> = {
    '@core': path.join(hostDir, 'src/js/core'),
    '@icons': path.join(hostDir, 'src/js/core'),
    '@helpers': path.join(hostDir, 'src/js/core/helpers'),
    '@redux': path.join(hostDir, 'src/js/redux'),
    '@styles': path.join(hostDir, 'src/styles/scss'),
    '@typedefs': path.join(hostDir, 'src/js/core/types'),
    '@uistrings': path.join(hostDir, 'src/js/core/constants/uistrings'),
    '@presentation': path.join(hostDir, 'src/js/presentation'),
    '@common_vocab': path.join(hostDir, 'src/js/core/constants/common_vocab'),
    '@test': path.join(hostDir, 'src/js/test'),
    '@root': path.join(hostDir, 'src/js'),
  }

  // Shared dependencies that must use the MFE's single copy (prevent duplicate React etc.)
  const sharedDeps = [
    'react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime',
    'react-redux', 'redux',
    'nhsuk-react-components', 'nhsuk-react-components-extensions',
  ]

  return {
    name: 'ncrs-host-alias',
    enforce: 'pre',
    resolveId(source, importer) {
      // Only apply for files within the host source directory
      if (!importer || !importer.startsWith(hostDir)) return null

      // Redirect shared dependencies to MFE's node_modules
      for (const dep of sharedDeps) {
        if (source === dep || source.startsWith(dep + '/')) {
          return this.resolve(source, path.join(mfeNodeModules, '_virtual.js'), { skipSelf: true })
        }
      }

      // Resolve host path aliases
      for (const [alias, target] of Object.entries(aliases)) {
        if (source === alias || source.startsWith(alias + '/')) {
          const resolved = source.replace(alias, target)
          for (const ext of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) {
            const fullPath = resolved + ext
            if (fs.existsSync(fullPath)) return fullPath
          }
        }
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [
    ncrsHostMocksPlugin(),
    ncrsHostAliasPlugin(),
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
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'test'),
  },
})
