export const DateInputMethods = {
  DateRange: 'DATE_RANGE',
  ExactDate: 'EXACT_DATE',
} as const

export type DateInputMethod = typeof DateInputMethods[keyof typeof DateInputMethods]
