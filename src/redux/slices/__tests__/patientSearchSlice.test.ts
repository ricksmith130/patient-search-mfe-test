import { describe, it, expect } from 'vitest'
import patientSearchReducer, {
  nhsSearchRequested,
  nhsSearchFailed,
  patientChanged,
  PatientSearchState,
} from '../patientSearchSlice'
import {
  NHS_NUMBER_SEARCH_REQUESTED,
  NHS_NUMBER_SEARCH_FAILED,
  PATIENT_CHANGED,
  PATIENT_UPDATED,
  // @ts-ignore
} from 'ncrs-host/ActionTypes'

const initialState: PatientSearchState = {
  isSearching: false,
  searchUuid: '',
  searchToken: '',
}

describe('patientSearchSlice (unit)', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      const state = patientSearchReducer(undefined, { type: '@@INIT' })
      expect(state).toEqual(initialState)
    })

    it('should handle nhsSearchRequested', () => {
      const state = patientSearchReducer(
        initialState,
        nhsSearchRequested({ nhsNumber: '9000000009', uuid: 'test-uuid-123' })
      )

      expect(state.isSearching).toBe(true)
      expect(state.searchUuid).toBe('test-uuid-123')
      expect(state.searchToken).toBe('9000000009')
    })

    it('should handle nhsSearchFailed', () => {
      const searchingState: PatientSearchState = {
        isSearching: true,
        searchUuid: 'test-uuid',
        searchToken: '9000000009',
      }

      const state = patientSearchReducer(searchingState, nhsSearchFailed())

      expect(state.isSearching).toBe(false)
      expect(state.searchUuid).toBe('test-uuid')
      expect(state.searchToken).toBe('9000000009')
    })

    it('should handle patientChanged', () => {
      const searchingState: PatientSearchState = {
        isSearching: true,
        searchUuid: 'test-uuid',
        searchToken: '9000000009',
      }

      const state = patientSearchReducer(searchingState, patientChanged())

      expect(state.isSearching).toBe(false)
      expect(state.searchToken).toBe('')
    })
  })

  describe('extraReducers (host action types)', () => {
    it('should handle NHS_NUMBER_SEARCH_REQUESTED', () => {
      const action = {
        type: NHS_NUMBER_SEARCH_REQUESTED,
        nhsNumber: '9000000009',
        uuid: 'host-uuid-456',
      }

      const state = patientSearchReducer(initialState, action)

      expect(state.isSearching).toBe(true)
      expect(state.searchUuid).toBe('host-uuid-456')
      expect(state.searchToken).toBe('9000000009')
    })

    it('should handle NHS_NUMBER_SEARCH_FAILED', () => {
      const searchingState: PatientSearchState = {
        isSearching: true,
        searchUuid: 'test-uuid',
        searchToken: '9000000009',
      }

      const state = patientSearchReducer(searchingState, {
        type: NHS_NUMBER_SEARCH_FAILED,
      })

      expect(state.isSearching).toBe(false)
    })

    it('should handle PATIENT_CHANGED', () => {
      const searchingState: PatientSearchState = {
        isSearching: true,
        searchUuid: 'test-uuid',
        searchToken: '9000000009',
      }

      const state = patientSearchReducer(searchingState, {
        type: PATIENT_CHANGED,
      })

      expect(state.isSearching).toBe(false)
      expect(state.searchToken).toBe('')
    })

    it('should handle PATIENT_UPDATED', () => {
      const searchingState: PatientSearchState = {
        isSearching: true,
        searchUuid: 'test-uuid',
        searchToken: '9000000009',
      }

      const state = patientSearchReducer(searchingState, {
        type: PATIENT_UPDATED,
      })

      expect(state.isSearching).toBe(false)
      expect(state.searchToken).toBe('')
    })

    it('should not react to unrelated actions', () => {
      const state = patientSearchReducer(initialState, {
        type: 'SOME_OTHER_ACTION',
      })

      expect(state).toEqual(initialState)
    })
  })
})
