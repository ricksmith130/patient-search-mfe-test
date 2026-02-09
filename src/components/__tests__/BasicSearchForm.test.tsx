import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BasicSearchForm from '../BasicSearchForm'
import { renderWithStore } from '@test/renderUtils'

const emptyDateParts = { day: '', month: '', year: '' }

const baseState = {
  connection: { internetConnection: true },
  findPatient: {
    dateInputMethods: { dob: 'DateRange', dod: 'DateRange' },
    dobTo: emptyDateParts,
    dobFrom: emptyDateParts,
    gender: '',
    surname: '',
    firstname: '',
    postcode: '',
    dodFrom: emptyDateParts,
    dodTo: emptyDateParts,
    addressEffectiveFrom: emptyDateParts,
    addressEffectiveTo: emptyDateParts,
    algorithmicSearch: false,
    includeDod: false,
  },
}

describe('BasicSearchForm', () => {
  it('renders all required form fields', () => {
    renderWithStore(<BasicSearchForm />, baseState)

    expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^female$/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^male$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /find a patient/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup()
    const { container } = renderWithStore(<BasicSearchForm />, baseState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const errorMessages = container.querySelectorAll('.nhsuk-error-message')
    expect(errorMessages.length).toBeGreaterThan(0)
  })

  it('can submit when all required fields are valid', async () => {
    const user = userEvent.setup()
    const filledState = {
      ...baseState,
      findPatient: {
        ...baseState.findPatient,
        surname: 'lister',
        dobFrom: { day: '01', month: '02', year: '2000' },
        gender: '2',
      },
    }
    const { container } = renderWithStore(<BasicSearchForm />, filledState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const errorMessages = container.querySelectorAll('.nhsuk-error-message')
    expect(errorMessages.length).toBe(0)
  })

  it('clears the form when clear button is clicked', async () => {
    const user = userEvent.setup()
    const filledState = {
      ...baseState,
      findPatient: {
        ...baseState.findPatient,
        surname: 'lister',
        gender: '2',
      },
    }
    const { getActions } = renderWithStore(<BasicSearchForm />, filledState)

    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)

    const actions = getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'findPatient/resetFormState' })
    )
  })

  it('shows connection warning modal when offline', async () => {
    const user = userEvent.setup()
    const offlineState = {
      ...baseState,
      connection: { internetConnection: false },
      findPatient: {
        ...baseState.findPatient,
        surname: 'lister',
        dobFrom: { day: '01', month: '02', year: '2000' },
        gender: '2',
      },
    }
    const { getActions } = renderWithStore(<BasicSearchForm />, offlineState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const actions = getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'NO_CONNECTION_FIND_PATIENT_MODAL' })
    )
  })
})
