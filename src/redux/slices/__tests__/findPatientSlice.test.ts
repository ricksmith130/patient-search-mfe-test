import { describe, it, expect } from 'vitest'
import findPatientReducer, { updateFormState, resetFormState } from '../findPatientSlice'
// @ts-ignore
import { DateInputMethods } from 'ncrs-host/DateConstants'
// @ts-ignore
import { getEmptyDateParts } from 'ncrs-host/SampleEmptyStates'

describe('findPatientSlice (unit)', () => {
  const initialState = {
    dateInputMethods: {
      dob: DateInputMethods.DateRange,
      dod: DateInputMethods.DateRange,
    },
    dobTo: getEmptyDateParts(),
    dobFrom: getEmptyDateParts(),
    gender: '',
    surname: '',
    firstname: '',
    postcode: '',
    dodFrom: getEmptyDateParts(),
    dodTo: getEmptyDateParts(),
    addressEffectiveFrom: getEmptyDateParts(),
    addressEffectiveTo: getEmptyDateParts(),
    algorithmicSearch: false,
    includeDod: false,
  }

  it('should handle updateFormState for basic fields', () => {
    const state = findPatientReducer(
      initialState,
      updateFormState({ surname: 'Smith', gender: '1' })
    )

    expect(state.surname).toBe('Smith')
    expect(state.gender).toBe('1')
    expect(state.firstname).toBe('')
  })

  it('should handle updateFormState for date fields', () => {
    const dobFrom = { day: '01', month: '01', year: '1980' }
    const state = findPatientReducer(
      initialState,
      updateFormState({ dobFrom })
    )

    expect(state.dobFrom).toEqual(dobFrom)
    expect(state.dobTo).toEqual(getEmptyDateParts())
  })

  it('should handle updateFormState for boolean fields', () => {
    const state = findPatientReducer(
      initialState,
      updateFormState({ algorithmicSearch: true, includeDod: true })
    )

    expect(state.algorithmicSearch).toBe(true)
    expect(state.includeDod).toBe(true)
  })

  it('should preserve dateInputMethods when updating other fields', () => {
    const state = findPatientReducer(
      initialState,
      updateFormState({ surname: 'Smith' })
    )

    expect(state.dateInputMethods).toEqual({
      dob: DateInputMethods.DateRange,
      dod: DateInputMethods.DateRange,
    })
  })

  it('should handle resetFormState and preserve dateInputMethods', () => {
    const modifiedState = {
      ...initialState,
      surname: 'Smith',
      gender: '1',
      firstname: 'John',
      postcode: 'SW1A 1AA',
      algorithmicSearch: true,
    }

    const state = findPatientReducer(modifiedState, resetFormState())

    expect(state.surname).toBe('')
    expect(state.gender).toBe('')
    expect(state.firstname).toBe('')
    expect(state.postcode).toBe('')
    expect(state.algorithmicSearch).toBe(false)
    expect(state.dateInputMethods).toEqual(modifiedState.dateInputMethods)
  })

  it('should handle multiple updateFormState actions sequentially', () => {
    let state = initialState

    state = findPatientReducer(state, updateFormState({ surname: 'Smith' }))
    expect(state.surname).toBe('Smith')

    state = findPatientReducer(state, updateFormState({ gender: '2' }))
    expect(state.surname).toBe('Smith')
    expect(state.gender).toBe('2')

    state = findPatientReducer(state, updateFormState({ firstname: 'Jane' }))
    expect(state.surname).toBe('Smith')
    expect(state.gender).toBe('2')
    expect(state.firstname).toBe('Jane')
  })
})
