import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdvancedSearchForm, { Props } from '../AdvancedSearchForm'
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
}

const filledState = {
  ...initialFindPatientState,
  gender: '2',
  surname: 'lister',
  firstname: 'maggie',
  postcode: 'NW1 1AA',
  dobFrom: { year: '1998', month: '10', day: '14' },
  dobTo: { year: '1998', month: '10', day: '14' },
  dodFrom: { year: '2000', month: '11', day: '12' },
  dodTo: { year: '2000', month: '11', day: '14' },
  includeDod: true,
}

describe('AdvancedSearchForm', () => {
  let testProps: Props
  let baseStoreState: Record<string, any>

  beforeEach(() => {
    testProps = {
      findPatientFormState: filledState as any,
      runAdvancedQuery: vi.fn(),
      internetConnection: true,
      showNoConnectionModal: vi.fn(),
      updateFormState: vi.fn(),
      resetFormState: vi.fn(),
    }

    baseStoreState = {
      findPatient: filledState,
      connection: { internetConnection: true },
    }
  })

  it('renders with all required form fields', () => {
    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    expect(container.querySelector('input[name="surname"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="firstname"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="postcode"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /find a patient/i })).toBeInTheDocument()
  })

  it('renders without initial values and shows empty form', () => {
    testProps.findPatientFormState = { ...initialFindPatientState, includeDod: true } as any

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const surnameInput = container.querySelector('input[name="surname"]') as HTMLInputElement
    const firstNameInput = container.querySelector('input[name="firstname"]') as HTMLInputElement
    expect(surnameInput.value).toBe('')
    expect(firstNameInput.value).toBe('')
  })

  it('contains all expected controls', () => {
    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    expect(container.querySelectorAll('input[name="gender"]')).toHaveLength(3)
    expect(container.querySelector('input[name="surname"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="firstname"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="postcode"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="algorithmicSearch"]')).toBeInTheDocument()
  })

  it('can submit when all required fields are valid', async () => {
    const user = userEvent.setup()
    testProps.findPatientFormState = {
      ...filledState,
      dodFrom: emptyDateParts,
      dodTo: emptyDateParts,
      includeDod: false,
    } as any

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    expect(container.querySelectorAll('.nhsuk-error-message')).toHaveLength(0)
    expect(testProps.runAdvancedQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        gender: '2',
        surname: 'lister',
        firstname: 'maggie',
        postcode: 'NW1 1AA',
        dobFrom: '19981014',
        dobTo: '19981014',
      })
    )
  })

  it('can submit when all fields are valid including DOD', async () => {
    const user = userEvent.setup()

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    expect(container.querySelectorAll('.nhsuk-error-message')).toHaveLength(0)
    expect(testProps.runAdvancedQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        dateOfDeathFrom: '20001112',
        dateOfDeathTo: '20001114',
      })
    )
  })

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup()
    testProps.findPatientFormState = { ...initialFindPatientState } as any

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const errorMessages = container.querySelectorAll('.nhsuk-error-message')
    expect(errorMessages.length).toBeGreaterThan(0)
    expect(testProps.runAdvancedQuery).not.toHaveBeenCalled()
  })

  it('shows no connection modal if offline', async () => {
    const user = userEvent.setup()
    testProps.internetConnection = false

    renderWithStore(<AdvancedSearchForm {...testProps} />, baseStoreState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    expect(testProps.showNoConnectionModal).toHaveBeenCalledTimes(1)
  })

  it('shows inset warning if search all is picked', async () => {
    const user = userEvent.setup()
    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    expect(container.querySelector('#gender-search-all-warning')).not.toBeInTheDocument()

    const searchAllRadio = container.querySelector(
      'input#advanced-search-form-gender-3'
    ) as HTMLInputElement
    await user.click(searchAllRadio)

    expect(
      container.querySelector('.nhsuk-inset-text#gender-search-all-warning')
    ).toBeInTheDocument()

    const femaleRadio = container.querySelector(
      'input#advanced-search-form-gender-1'
    ) as HTMLInputElement
    await user.click(femaleRadio)

    expect(container.querySelector('#gender-search-all-warning')).not.toBeInTheDocument()
  })

  it('shows validation errors when required fields are missing', async () => {
    const user = userEvent.setup()
    testProps.findPatientFormState = { ...initialFindPatientState } as any

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const errorMessages = container.querySelectorAll('.nhsuk-error-message')
    expect(errorMessages.length).toBeGreaterThanOrEqual(2)
  })

  it('calls resetFormState when clear button is clicked', async () => {
    const user = userEvent.setup()
    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const clearButton = container.querySelector(
      '#advanced-search-form-clear-button'
    ) as HTMLElement

    await user.click(clearButton)
    expect(testProps.resetFormState).toHaveBeenCalledTimes(1)

    clearButton.focus()
    await user.keyboard('{Enter}')
    expect(testProps.resetFormState).toHaveBeenCalledTimes(2)
  })

  it('shows Date of Death fields when includeDod box is checked', async () => {
    const user = userEvent.setup()
    testProps.findPatientFormState = { ...initialFindPatientState } as any
    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    expect(
      container.querySelector('#advanced-search-form-dod-date-method-switcher')
    ).not.toBeInTheDocument()

    const includeDodCheckbox = container.querySelector(
      'input#advanced-search-form-include-dod'
    ) as HTMLInputElement
    await user.click(includeDodCheckbox)

    expect(
      container.querySelector('#advanced-search-form-dod-date-method-switcher')
    ).toBeInTheDocument()
  })

  it('hides Date of Death fields when includeDod box is unchecked', async () => {
    const user = userEvent.setup()
    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    expect(
      container.querySelector('#advanced-search-form-dod-date-method-switcher')
    ).toBeInTheDocument()

    const includeDodCheckbox = container.querySelector(
      'input#advanced-search-form-include-dod'
    ) as HTMLInputElement
    await user.click(includeDodCheckbox)

    expect(
      container.querySelector('#advanced-search-form-dod-date-method-switcher')
    ).not.toBeInTheDocument()
  })

  it('updates firstname field when typing', async () => {
    const user = userEvent.setup()
    testProps.findPatientFormState = { ...initialFindPatientState } as any

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const firstnameInput = container.querySelector(
      'input[name="firstname"]'
    ) as HTMLInputElement

    await user.type(firstnameInput, 'John')
    expect(firstnameInput.value).toBe('John')
  })

  it('updates surname field when typing', async () => {
    const user = userEvent.setup()
    testProps.findPatientFormState = { ...initialFindPatientState } as any

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const surnameInput = container.querySelector(
      'input[name="surname"]'
    ) as HTMLInputElement

    await user.type(surnameInput, 'Smith')
    expect(surnameInput.value).toBe('Smith')
  })

  it('formats postcode when typing', async () => {
    const user = userEvent.setup()
    testProps.findPatientFormState = { ...initialFindPatientState } as any

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const postcodeInput = container.querySelector(
      'input[name="postcode"]'
    ) as HTMLInputElement

    await user.type(postcodeInput, 'sw1a1aa')
    expect(postcodeInput.value).toBe('SW1A 1AA')
  })

  it('toggles algorithmic search checkbox', async () => {
    const user = userEvent.setup()
    testProps.findPatientFormState = {
      ...initialFindPatientState,
      algorithmicSearch: false,
    } as any

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const algorithmicCheckbox = container.querySelector(
      'input[name="algorithmicSearch"]'
    ) as HTMLInputElement

    expect(algorithmicCheckbox.checked).toBe(false)
    await user.click(algorithmicCheckbox)
    expect(algorithmicCheckbox.checked).toBe(true)
    await user.click(algorithmicCheckbox)
    expect(algorithmicCheckbox.checked).toBe(false)
  })

  it('auto-enables includeDod when dodFrom date is pre-filled', () => {
    testProps.findPatientFormState = {
      ...initialFindPatientState,
      includeDod: false,
      dodFrom: { year: '2020', month: '01', day: '15' },
    } as any

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    expect(
      container.querySelector('#advanced-search-form-dod-date-method-switcher')
    ).toBeInTheDocument()
  })

  it('selects male gender radio button', async () => {
    const user = userEvent.setup()
    testProps.findPatientFormState = { ...initialFindPatientState } as any

    const { container } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    const maleRadio = container.querySelector(
      'input#advanced-search-form-gender-2'
    ) as HTMLInputElement
    await user.click(maleRadio)

    expect(maleRadio.checked).toBe(true)
  })

  it('calls updateFormState on unmount', () => {
    const { unmount } = renderWithStore(
      <AdvancedSearchForm {...testProps} />,
      baseStoreState
    )

    unmount()

    expect(testProps.updateFormState).toHaveBeenCalled()
  })

  it('submits with algorithmic search enabled', async () => {
    const user = userEvent.setup()
    testProps.findPatientFormState = {
      ...filledState,
      algorithmicSearch: true,
      includeDod: false,
      dodFrom: emptyDateParts,
      dodTo: emptyDateParts,
    } as any

    renderWithStore(<AdvancedSearchForm {...testProps} />, baseStoreState)

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    expect(testProps.runAdvancedQuery).toHaveBeenCalledWith(
      expect.objectContaining({ algorithmicSearch: true })
    )
  })

  it('uses default dispatchers when props are not provided', () => {
    const minimalProps: Props = {
      findPatientFormState: filledState as any,
      internetConnection: true,
    }

    renderWithStore(<AdvancedSearchForm {...minimalProps} />, baseStoreState)

    expect(screen.getByRole('button', { name: /find a patient/i })).toBeInTheDocument()
  })

  it('uses default showNoConnectionModal dispatcher when offline', async () => {
    const user = userEvent.setup()
    const minimalProps: Props = {
      findPatientFormState: filledState as any,
      internetConnection: false,
    }

    const { getActions } = renderWithStore(
      <AdvancedSearchForm {...minimalProps} />,
      baseStoreState
    )

    const submitButton = screen.getByRole('button', { name: /find a patient/i })
    await user.click(submitButton)

    const actions = getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'NO_CONNECTION_FIND_PATIENT_MODAL' })
    )
  })

  it('uses default resetFormState dispatcher when clear is clicked', async () => {
    const user = userEvent.setup()
    const minimalProps: Props = {
      findPatientFormState: filledState as any,
      internetConnection: true,
    }

    const { container, getActions } = renderWithStore(
      <AdvancedSearchForm {...minimalProps} />,
      baseStoreState
    )

    const clearButton = container.querySelector(
      '#advanced-search-form-clear-button'
    ) as HTMLElement
    await user.click(clearButton)

    const actions = getActions()
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'findPatient/resetFormState' })
    )
  })
})
