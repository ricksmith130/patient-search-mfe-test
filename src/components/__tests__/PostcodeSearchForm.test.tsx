import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostcodeSearchForm from '../PostcodeSearchForm'
import { renderWithStore } from '../../test/renderUtils'

const emptyDateParts = { day: '', month: '', year: '' }

const initialFindPatientState = {
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
  ignoreHistoryIndicator: '1',
}

const filledState = {
  ...initialFindPatientState,
  surname: 'lister',
  firstname: 'maggie',
  postcode: 'NW1 1AA',
  dobFrom: { year: '1998', month: '10', day: '14' },
  dobTo: { year: '1998', month: '10', day: '14' },
  addressEffectiveFrom: { year: '1900', month: '01', day: '01' },
  addressEffectiveTo: { year: '2022', month: '01', day: '01' },
}

describe('PostcodeSearchForm', () => {
  let baseStoreState: Record<string, any>

  beforeEach(() => {
    baseStoreState = {
      findPatient: filledState,
      connection: { internetConnection: true },
    }
  })

  it('renders with all required form fields', () => {
    const { container } = renderWithStore(<PostcodeSearchForm />, baseStoreState)

    expect(container.querySelector('input[name="postcode"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /find a patient/i })).toBeInTheDocument()
  })

  it('renders with checkbox unchecked when ignoreHistoryIndicator is 1', () => {
    const { container } = renderWithStore(<PostcodeSearchForm />, baseStoreState)

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(checkbox).toBeInTheDocument()
    expect(checkbox.checked).toBe(false)
  })

  it('contains all expected input controls', () => {
    const { container } = renderWithStore(<PostcodeSearchForm />, baseStoreState)

    expect(container.querySelector('input[name="firstname"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="surname"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="postcode"]')).toBeInTheDocument()
  })

  it('can submit when all required fields are valid', async () => {
    const user = userEvent.setup()
    const { container } = renderWithStore(<PostcodeSearchForm />, baseStoreState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    expect(container.querySelectorAll('.nhsuk-error-message')).toHaveLength(0)
  })

  it('shows validation errors when submitting with empty postcode', async () => {
    const user = userEvent.setup()
    const emptyState = {
      ...baseStoreState,
      findPatient: {
        ...initialFindPatientState,
        postcode: '',
        firstname: '',
        surname: '',
      },
    }
    const { container } = renderWithStore(<PostcodeSearchForm />, emptyState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const errorMessages = container.querySelectorAll('.nhsuk-error-message')
    expect(errorMessages.length).toBeGreaterThan(0)
  })

  it('shows no connection modal when offline', async () => {
    const user = userEvent.setup()
    const offlineState = {
      ...baseStoreState,
      connection: { internetConnection: false },
    }
    const { getActions } = renderWithStore(<PostcodeSearchForm />, offlineState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const actions = getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'NO_CONNECTION_FIND_PATIENT_MODAL' })
    )
  })

  it('shows error when dates are blank and ignoreHistoryIndicator is 0', async () => {
    const user = userEvent.setup()
    const stateWithPreviousOccupants = {
      ...baseStoreState,
      findPatient: {
        ...initialFindPatientState,
        postcode: 'NW1 1AA',
        ignoreHistoryIndicator: '0',
      },
    }
    const { container } = renderWithStore(<PostcodeSearchForm />, stateWithPreviousOccupants)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const errorMessage = container.querySelector('.nhsuk-error-message')
    expect(errorMessage?.textContent).toContain('occupant')
  })

  it('does not show error when dates are blank and ignoreHistoryIndicator is 1', async () => {
    const user = userEvent.setup()
    const stateWithPostcode = {
      ...baseStoreState,
      findPatient: {
        ...initialFindPatientState,
        postcode: 'NW1 1AA',
        ignoreHistoryIndicator: '1',
      },
    }
    const { container } = renderWithStore(<PostcodeSearchForm />, stateWithPostcode)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    expect(container.querySelectorAll('.nhsuk-error-message')).toHaveLength(0)
  })

  it('calls resetFormState when clear button is clicked', async () => {
    const user = userEvent.setup()
    const { container, getActions } = renderWithStore(<PostcodeSearchForm />, baseStoreState)

    const clearButton = container.querySelector(
      '#postcode-search-form-clear-button'
    ) as HTMLElement
    expect(clearButton).toBeInTheDocument()

    await user.click(clearButton)

    const actions = getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'findPatient/resetFormState' })
    )
  })

  it('calls resetFormState when Enter pressed on clear button', async () => {
    const user = userEvent.setup()
    const { container, getActions } = renderWithStore(<PostcodeSearchForm />, baseStoreState)

    const clearButton = container.querySelector(
      '#postcode-search-form-clear-button'
    ) as HTMLElement
    clearButton.focus()
    await user.keyboard('{Enter}')

    const actions = getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'findPatient/resetFormState' })
    )
  })

  it('switches DOB input method when button is clicked', async () => {
    const user = userEvent.setup()
    const { container } = renderWithStore(<PostcodeSearchForm />, baseStoreState)

    const dobSwitcherButton = container.querySelector(
      '#postcode-search-form-dob-control-a'
    ) as HTMLElement
    if (dobSwitcherButton) {
      await user.click(dobSwitcherButton)
      expect(
        container.querySelector('#postcode-search-form-dob-date-method-switcher')
      ).toBeInTheDocument()
    }
  })

  it('pre-selects checkbox when ignoreHistoryIndicator is 0', () => {
    const stateWithPreviousOccupants = {
      ...baseStoreState,
      findPatient: {
        ...filledState,
        ignoreHistoryIndicator: '0',
      },
    }
    const { container } = renderWithStore(<PostcodeSearchForm />, stateWithPreviousOccupants)

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(checkbox.defaultChecked).toBe(true)
  })

  it('does not pre-select checkbox when ignoreHistoryIndicator is 1', () => {
    const { container } = renderWithStore(<PostcodeSearchForm />, baseStoreState)

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(checkbox.defaultChecked).toBe(false)
  })

  it('formats postcode when typing', async () => {
    const user = userEvent.setup()
    const emptyPostcodeState = {
      ...baseStoreState,
      findPatient: { ...initialFindPatientState },
    }
    const { container } = renderWithStore(<PostcodeSearchForm />, emptyPostcodeState)

    const postcodeInput = container.querySelector(
      'input[name="postcode"]'
    ) as HTMLInputElement

    await user.type(postcodeInput, 'sw1a1aa')
    expect(postcodeInput.value).toBe('SW1A 1AA')
  })

  it('updates firstname field when typing', async () => {
    const user = userEvent.setup()
    const emptyState = {
      ...baseStoreState,
      findPatient: { ...initialFindPatientState },
    }
    const { container } = renderWithStore(<PostcodeSearchForm />, emptyState)

    const firstnameInput = container.querySelector(
      'input[name="firstname"]'
    ) as HTMLInputElement

    await user.type(firstnameInput, 'John')
    expect(firstnameInput.value).toBe('John')
  })

  it('updates surname field when typing', async () => {
    const user = userEvent.setup()
    const emptyState = {
      ...baseStoreState,
      findPatient: { ...initialFindPatientState },
    }
    const { container } = renderWithStore(<PostcodeSearchForm />, emptyState)

    const surnameInput = container.querySelector(
      'input[name="surname"]'
    ) as HTMLInputElement

    await user.type(surnameInput, 'Smith')
    expect(surnameInput.value).toBe('Smith')
  })
})
