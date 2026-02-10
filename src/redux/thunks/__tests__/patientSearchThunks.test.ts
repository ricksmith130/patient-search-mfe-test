import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import {
  performBasicSearch,
  performAdvancedSearch,
  performPostcodeSearch,
} from '../patientSearchThunks'
import { ncrsFetch } from 'ncrs-host/HttpClient'
import {
  navigateToSearchResultsAction,
  navigateToAdvancedSearchAction,
  navigateToPostcodeSearchAction,
} from 'ncrs-host/NavigationActions'
import { activateBasicSearchTab } from 'ncrs-host/TabActionCreator'
import queryResultsReducer from '../../slices/queryResultsSlice'

const createStore = () =>
  configureStore({
    reducer: { query: queryResultsReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('patientSearchThunks', () => {
  describe('performBasicSearch', () => {
    it('should call ncrsFetch with correct URL and query', async () => {
      const query = { gender: '1', surname: 'Smith', dobFrom: '', searchUuid: '' }
      const mockResults = { results: [{ nhsNumber: '9000000009' }], resultsCount: 1 }

      vi.mocked(ncrsFetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      } as any)

      const store = createStore()
      await store.dispatch(performBasicSearch(query))

      expect(ncrsFetch).toHaveBeenCalledWith('/api/basic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      })
    })

    it('should dispatch navigateToSearchResultsAction on success', async () => {
      vi.mocked(ncrsFetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [], resultsCount: 0 }),
      } as any)

      const store = createStore()
      await store.dispatch(performBasicSearch({ gender: '', surname: '', dobFrom: '', searchUuid: '' }))

      expect(navigateToSearchResultsAction).toHaveBeenCalled()
    })

    it('should dispatch activateBasicSearchTab on failure', async () => {
      vi.mocked(ncrsFetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      } as any)

      const store = createStore()
      const result = await store.dispatch(
        performBasicSearch({ gender: '', surname: '', dobFrom: '', searchUuid: '' })
      )

      expect(activateBasicSearchTab).toHaveBeenCalled()
      expect(result.meta.rejectedWithValue).toBe(true)
    })

    it('should handle network errors', async () => {
      vi.mocked(ncrsFetch).mockRejectedValueOnce(new Error('Network error'))

      const store = createStore()
      const result = await store.dispatch(
        performBasicSearch({ gender: '', surname: '', dobFrom: '', searchUuid: '' })
      )

      expect(activateBasicSearchTab).toHaveBeenCalled()
      expect(result.meta.rejectedWithValue).toBe(true)
    })
  })

  describe('performAdvancedSearch', () => {
    it('should call ncrsFetch with correct URL', async () => {
      vi.mocked(ncrsFetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [], resultsCount: 0 }),
      } as any)

      const query = { gender: '2', surname: 'Jones', dobFrom: '1990-01-01', searchUuid: '' }
      const store = createStore()
      await store.dispatch(performAdvancedSearch(query))

      expect(ncrsFetch).toHaveBeenCalledWith('/api/advanced-search', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(query),
      }))
    })

    it('should dispatch navigateToSearchResultsAction on success', async () => {
      vi.mocked(ncrsFetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [], resultsCount: 0 }),
      } as any)

      const store = createStore()
      await store.dispatch(performAdvancedSearch({ gender: '', surname: '', dobFrom: '', searchUuid: '' }))

      expect(navigateToSearchResultsAction).toHaveBeenCalled()
    })

    it('should dispatch navigateToAdvancedSearchAction on failure', async () => {
      vi.mocked(ncrsFetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Bad request' }),
      } as any)

      const store = createStore()
      const result = await store.dispatch(
        performAdvancedSearch({ gender: '', surname: '', dobFrom: '', searchUuid: '' })
      )

      expect(navigateToAdvancedSearchAction).toHaveBeenCalled()
      expect(result.meta.rejectedWithValue).toBe(true)
    })
  })

  describe('performPostcodeSearch', () => {
    it('should call ncrsFetch with correct URL', async () => {
      vi.mocked(ncrsFetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [], resultsCount: 0 }),
      } as any)

      const query = { postcode: 'SW1A 1AA' }
      const store = createStore()
      await store.dispatch(performPostcodeSearch(query))

      expect(ncrsFetch).toHaveBeenCalledWith('/api/postcode-search', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(query),
      }))
    })

    it('should dispatch navigateToSearchResultsAction on success', async () => {
      vi.mocked(ncrsFetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [], resultsCount: 0 }),
      } as any)

      const store = createStore()
      await store.dispatch(performPostcodeSearch({ postcode: 'SW1A 1AA' }))

      expect(navigateToSearchResultsAction).toHaveBeenCalled()
    })

    it('should dispatch navigateToPostcodeSearchAction on failure', async () => {
      vi.mocked(ncrsFetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      } as any)

      const store = createStore()
      const result = await store.dispatch(
        performPostcodeSearch({ postcode: 'SW1A 1AA' })
      )

      expect(navigateToPostcodeSearchAction).toHaveBeenCalled()
      expect(result.meta.rejectedWithValue).toBe(true)
    })

    it('should handle non-JSON error responses', async () => {
      vi.mocked(ncrsFetch).mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: () => Promise.reject(new Error('Not JSON')),
      } as any)

      const store = createStore()
      const result = await store.dispatch(
        performPostcodeSearch({ postcode: 'SW1A 1AA' })
      )

      expect(navigateToPostcodeSearchAction).toHaveBeenCalled()
      expect(result.meta.rejectedWithValue).toBe(true)
    })
  })
})
