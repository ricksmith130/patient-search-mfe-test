import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import queryResultsReducer, {
  changeTableOptions,
  clearQueryData,
  QueryResultsState,
} from '../queryResultsSlice'
// @ts-ignore
import { CLEAR_PATIENT_SEARCH_DATA, CLEAR_ALL_NON_USER_DATA } from 'ncrs-host/ActionTypes'
import { LOCATION_CHANGE } from 'redux-first-history'
import {
  performBasicSearch,
  performAdvancedSearch,
  performPostcodeSearch,
} from '../../thunks/patientSearchThunks'

const initialState: QueryResultsState = {
  queryResults: { results: [], resultsCount: 0, options: {} },
  queryArguments: { gender: '', surname: '', dobFrom: '', searchUuid: '' },
  postcodeSearchArguments: { postcode: '' },
  queryType: '',
  hasData: false,
}

const createStore = (preloadedState?: { query: QueryResultsState }) =>
  configureStore({
    reducer: { query: queryResultsReducer },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  })

describe('queryResultsSlice (unit)', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      const state = queryResultsReducer(undefined, { type: '@@INIT' })
      expect(state).toEqual(initialState)
    })

    it('should handle changeTableOptions with filters', () => {
      const state = queryResultsReducer(
        initialState,
        changeTableOptions({ filters: { name: 'Smith' } })
      )

      expect(state.queryResults.options.filterBy).toEqual({ name: 'Smith' })
    })

    it('should handle changeTableOptions with sort', () => {
      const state = queryResultsReducer(
        initialState,
        changeTableOptions({ sort: { field: 'name', direction: 'asc' } })
      )

      expect(state.queryResults.options.sortBy).toEqual({ field: 'name', direction: 'asc' })
    })

    it('should handle changeTableOptions with pagination', () => {
      const state = queryResultsReducer(
        initialState,
        changeTableOptions({ pagination: { page: 2, pageSize: 25 } })
      )

      expect(state.queryResults.options.pagination).toEqual({ page: 2, pageSize: 25 })
    })

    it('should handle changeTableOptions with scrollPosition', () => {
      const state = queryResultsReducer(
        initialState,
        changeTableOptions({ scrollPosition: 150 })
      )

      expect(state.queryResults.options.scrollPosition).toBe(150)
    })

    it('should handle changeTableOptions with lastNameFirst', () => {
      const state = queryResultsReducer(
        initialState,
        changeTableOptions({ lastNameFirst: true })
      )

      expect(state.queryResults.options.lastNameFirst).toBe(true)
    })

    it('should merge multiple table option updates', () => {
      let state = queryResultsReducer(
        initialState,
        changeTableOptions({ filters: { name: 'Smith' } })
      )
      state = queryResultsReducer(
        state,
        changeTableOptions({ sort: { field: 'name', direction: 'asc' } })
      )

      expect(state.queryResults.options.filterBy).toEqual({ name: 'Smith' })
      expect(state.queryResults.options.sortBy).toEqual({ field: 'name', direction: 'asc' })
    })

    it('should handle clearQueryData', () => {
      const populatedState: QueryResultsState = {
        queryResults: {
          results: [{ nhsNumber: '9000000009' }],
          resultsCount: 1,
          options: { filterBy: { name: 'Smith' } },
        },
        queryArguments: { gender: '1', surname: 'Smith', dobFrom: '', searchUuid: 'uuid-1' },
        postcodeSearchArguments: { postcode: 'SW1A 1AA' },
        queryType: 'BASIC',
        hasData: true,
      }

      const state = queryResultsReducer(populatedState, clearQueryData())
      expect(state).toEqual(initialState)
    })
  })

  describe('extraReducers — thunk lifecycle', () => {
    it('should set queryArguments and queryType on performBasicSearch.pending', () => {
      const store = createStore()
      store.dispatch({
        type: performBasicSearch.pending.type,
        meta: {
          arg: { gender: '1', surname: 'Smith' },
          requestId: 'req-123',
        },
      })

      const state = store.getState().query
      expect(state.queryType).toBe('BASIC')
      expect(state.hasData).toBe(true)
      expect(state.queryArguments.searchUuid).toBe('req-123')
    })

    it('should set queryResults on performBasicSearch.fulfilled', () => {
      const store = createStore()
      store.dispatch({
        type: performBasicSearch.fulfilled.type,
        payload: { results: [{ nhsNumber: '9000000009' }], resultsCount: 1 },
        meta: { arg: {}, requestId: 'req-123' },
      })

      const state = store.getState().query
      expect(state.queryResults.results).toEqual([{ nhsNumber: '9000000009' }])
      expect(state.queryResults.resultsCount).toBe(1)
    })

    it('should reset queryResults on performBasicSearch.rejected', () => {
      const populatedState: QueryResultsState = {
        ...initialState,
        queryResults: {
          results: [{ nhsNumber: '9000000009' }],
          resultsCount: 1,
          options: {},
        },
        hasData: true,
      }

      const state = queryResultsReducer(populatedState, {
        type: performBasicSearch.rejected.type,
        meta: { arg: {}, requestId: 'req-123' },
      })

      expect(state.queryResults.results).toEqual([])
      expect(state.queryResults.resultsCount).toBe(0)
    })

    it('should set queryArguments and queryType on performAdvancedSearch.pending', () => {
      const store = createStore()
      store.dispatch({
        type: performAdvancedSearch.pending.type,
        meta: {
          arg: { gender: '2', surname: 'Jones' },
          requestId: 'req-456',
        },
      })

      const state = store.getState().query
      expect(state.queryType).toBe('ADVANCED')
      expect(state.hasData).toBe(true)
    })

    it('should set queryResults on performAdvancedSearch.fulfilled', () => {
      const store = createStore()
      store.dispatch({
        type: performAdvancedSearch.fulfilled.type,
        payload: { results: [{ nhsNumber: '1234567890' }], resultsCount: 1 },
        meta: { arg: {}, requestId: 'req-456' },
      })

      expect(store.getState().query.queryResults.resultsCount).toBe(1)
    })

    it('should reset queryResults on performAdvancedSearch.rejected', () => {
      const state = queryResultsReducer(initialState, {
        type: performAdvancedSearch.rejected.type,
        meta: { arg: {}, requestId: 'req-456' },
      })

      expect(state.queryResults).toEqual(initialState.queryResults)
    })

    it('should set postcodeSearchArguments on performPostcodeSearch.pending', () => {
      const store = createStore()
      store.dispatch({
        type: performPostcodeSearch.pending.type,
        meta: {
          arg: { postcode: 'SW1A 1AA' },
          requestId: 'req-789',
        },
      })

      const state = store.getState().query
      expect(state.queryType).toBe('POSTCODE')
      expect(state.hasData).toBe(true)
      expect(state.postcodeSearchArguments.postcode).toBe('SW1A 1AA')
    })

    it('should set queryResults on performPostcodeSearch.fulfilled', () => {
      const store = createStore()
      store.dispatch({
        type: performPostcodeSearch.fulfilled.type,
        payload: { results: [{ nhsNumber: '5555555555' }], resultsCount: 1 },
        meta: { arg: {}, requestId: 'req-789' },
      })

      expect(store.getState().query.queryResults.resultsCount).toBe(1)
    })

    it('should reset queryResults on performPostcodeSearch.rejected', () => {
      const state = queryResultsReducer(initialState, {
        type: performPostcodeSearch.rejected.type,
        meta: { arg: {}, requestId: 'req-789' },
      })

      expect(state.queryResults).toEqual(initialState.queryResults)
    })
  })

  describe('extraReducers — host action types', () => {
    it('should reset state on CLEAR_PATIENT_SEARCH_DATA', () => {
      const populatedState: QueryResultsState = {
        queryResults: {
          results: [{ nhsNumber: '9000000009' }],
          resultsCount: 1,
          options: {},
        },
        queryArguments: { gender: '1', surname: 'Smith', dobFrom: '', searchUuid: 'uuid-1' },
        postcodeSearchArguments: { postcode: '' },
        queryType: 'BASIC',
        hasData: true,
      }

      const state = queryResultsReducer(populatedState, {
        type: CLEAR_PATIENT_SEARCH_DATA,
      })

      expect(state).toEqual(initialState)
    })

    it('should reset state on CLEAR_ALL_NON_USER_DATA', () => {
      const populatedState: QueryResultsState = {
        ...initialState,
        queryType: 'ADVANCED',
        hasData: true,
      }

      const state = queryResultsReducer(populatedState, {
        type: CLEAR_ALL_NON_USER_DATA,
      })

      expect(state).toEqual(initialState)
    })

    it('should reset state on LOCATION_CHANGE without keep flags', () => {
      const populatedState: QueryResultsState = {
        ...initialState,
        queryType: 'BASIC',
        hasData: true,
      }

      const state = queryResultsReducer(populatedState, {
        type: LOCATION_CHANGE,
        payload: { location: { state: {} } },
      })

      expect(state).toEqual(initialState)
    })

    it('should preserve state on LOCATION_CHANGE with KEEP_QUERY flag', () => {
      const populatedState: QueryResultsState = {
        ...initialState,
        queryType: 'BASIC',
        hasData: true,
      }

      const state = queryResultsReducer(populatedState, {
        type: LOCATION_CHANGE,
        payload: { location: { state: { KEEP_QUERY: true } } },
      })

      expect(state.queryType).toBe('BASIC')
      expect(state.hasData).toBe(true)
    })

    it('should not react to unrelated actions', () => {
      const state = queryResultsReducer(initialState, {
        type: 'SOME_OTHER_ACTION',
      })

      expect(state).toEqual(initialState)
    })
  })
})
