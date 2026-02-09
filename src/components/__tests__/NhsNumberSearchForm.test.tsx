import { afterAll, beforeAll, describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NhsNumberSearchForm from '../NhsNumberSearchForm'
import { renderWithStore } from '@test/renderUtils'

// Suppress expected console warnings from NHS UK components
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('not wrapped in act(...)') ||
        args[0].includes('checked` prop to a form field without an `onChange`'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

const baseState = {
  deepLink: { active: false, nhsNumber: '', urpId: '', searchUuid: '', error: false },
  patientSearch: { searchToken: '' },
  connection: { internetConnection: true },
}

describe('NhsNumberSearchForm', () => {
  it('renders with NHS Number input and find button', () => {
    renderWithStore(<NhsNumberSearchForm />, baseState)

    expect(screen.getByRole('textbox', { name: /nhs number/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /find a patient/i })).toBeInTheDocument()
  })

  it('calls search on submit with valid NHS number', async () => {
    const user = userEvent.setup()
    const testState = {
      ...baseState,
      patientSearch: { searchToken: '9999999999' },
    }
    const { store } = renderWithStore(<NhsNumberSearchForm />, testState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const actions = store.getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'NHS_NUMBER_SEARCH_REQUESTED', nhsNumber: '9999999999' })
    )
  })

  it('shows an error when NHS number is too short', async () => {
    const user = userEvent.setup()
    const testState = {
      ...baseState,
      patientSearch: { searchToken: '123456' },
    }
    const { container } = renderWithStore(<NhsNumberSearchForm />, testState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const errorMessage = container.querySelector('.nhsuk-error-message')
    expect(errorMessage?.textContent).toContain('NHS Number must be 10 digits long')
  })

  it('shows an error when NHS number is invalid', async () => {
    const user = userEvent.setup()
    const testState = {
      ...baseState,
      patientSearch: { searchToken: '9999999998' },
    }
    const { container } = renderWithStore(<NhsNumberSearchForm />, testState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const errorMessage = container.querySelector('.nhsuk-error-message')
    expect(errorMessage?.textContent).toContain('This is not a valid NHS Number')
  })

  it('shows modal on submit with no network connection', async () => {
    const user = userEvent.setup()
    const testState = {
      ...baseState,
      patientSearch: { searchToken: '9999999999' },
      connection: { internetConnection: false },
    }
    const { store } = renderWithStore(<NhsNumberSearchForm />, testState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const actions = store.getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'NO_CONNECTION_FIND_PATIENT_MODAL' })
    )
  })

  it('triggers NHS number search when accessed via deep link', () => {
    const testState = {
      ...baseState,
      deepLink: {
        nhsNumber: '9999999999',
        urpId: '',
        active: true,
        searchUuid: '',
        error: false,
      },
    }
    const { store } = renderWithStore(<NhsNumberSearchForm />, testState)

    expect(screen.getByRole('textbox', { name: /nhs number/i })).toBeInTheDocument()
    const actions = store.getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'NHS_NUMBER_SEARCH_REQUESTED', nhsNumber: '9999999999' })
    )
  })
})
