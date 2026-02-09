import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NhsNumberSearchForm from '../NhsNumberSearchForm'
import { renderWithStore } from '@test/renderUtils'

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
    const { getActions } = renderWithStore(<NhsNumberSearchForm />, testState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const actions = getActions()
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
    const { getActions } = renderWithStore(<NhsNumberSearchForm />, testState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const actions = getActions()
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
    const { getActions } = renderWithStore(<NhsNumberSearchForm />, testState)

    expect(screen.getByRole('textbox', { name: /nhs number/i })).toBeInTheDocument()
    const actions = getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'NHS_NUMBER_SEARCH_REQUESTED', nhsNumber: '9999999999' })
    )
  })
})
