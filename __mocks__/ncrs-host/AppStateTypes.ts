export interface DateParts {
  day: string
  month: string
  year: string
}

export interface DateInputMethodState {
  dob: string
  dod: string
}

export interface FindPatientStates {
  dateInputMethods: DateInputMethodState
  dobTo: DateParts
  dobFrom: DateParts
  gender: string
  surname: string
  firstname: string
  postcode: string
  dodFrom: DateParts
  dodTo: DateParts
  addressEffectiveFrom: DateParts
  addressEffectiveTo: DateParts
  algorithmicSearch: boolean
  includeDod: boolean
}

export type SearchFormUpdate = Partial<FindPatientStates>
