import { configureStore } from '@reduxjs/toolkit'
import findPatientReducer from '@redux/slices/findPatientSlice'
import queryResultsReducer from '@redux/slices/queryResultsSlice'
import patientSearchReducer from '@redux/slices/patientSearchSlice'

/**
 * Creates a test store with MFE reducers
 * Note: This does NOT include host reducers - those come from real host at runtime
 */
export const createTestStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      findPatient: findPatientReducer,
      query: queryResultsReducer,
      patientSearch: patientSearchReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Allow non-serializable in tests
      }),
  })
}

/**
 * Returns the default MFE state for testing
 * Matches the initial states from all MFE slices
 */
export const getDefaultMfeState = () => ({
  findPatient: {
    dateInputMethods: {
      dob: 'DATE_RANGE',
      dod: 'DATE_RANGE',
    },
    dobTo: { day: '', month: '', year: '' },
    dobFrom: { day: '', month: '', year: '' },
    gender: '',
    surname: '',
    firstname: '',
    postcode: '',
    dodFrom: { day: '', month: '', year: '' },
    dodTo: { day: '', month: '', year: '' },
    addressEffectiveFrom: { day: '', month: '', year: '' },
    addressEffectiveTo: { day: '', month: '', year: '' },
    algorithmicSearch: false,
    includeDod: false,
  },
  query: {
    queryResults: { results: [], resultsCount: 0, options: {} },
    queryArguments: { gender: '', surname: '', dobFrom: '', searchUuid: '' },
    postcodeSearchArguments: { postcode: '' },
    queryType: '',
    hasData: false,
  },
  patientSearch: {
    isSearching: false,
    searchUuid: '',
    searchToken: '',
  },
})

export type TestState = ReturnType<typeof getDefaultMfeState>
