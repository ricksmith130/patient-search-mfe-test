// Type declarations for federated modules from ncrs-host
// These modules are loaded at runtime via module federation
// Using permissive types to allow TypeScript compilation

declare module 'ncrs-host/*' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/IdConstants' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/AppStateTypes' {
  export type PatientSearchQueryResults = any
  export type QueryArguments = any
  export type PostcodeSearchArguments = any
  export type PatientSearchResultsTableOptionsUpdate = any
  export type FindPatientStates = any
  export type SearchFormUpdate = any
  export type DateParts<T = string> = any
}

declare module 'ncrs-host/Sentinel' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/TopButton' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/NavigationWarning' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/PatientRetrievalBlocked' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/IntersectionObserver' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/LogTransactions' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/LogActionCreator' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/NhsNumberQueryActionCreator' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/SaveQueryActionCreator' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/store' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/BirthNotificationResultsStrings' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/CommonStrings' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/GenericStrings' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/SpineVocabulary' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/AccessibilityHelpers' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/GenericHelpers' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/QueryResultsHelper' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/SmallComponents' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/PaginationControls' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/DateFormatter' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/GenderFormatter' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/NameFormatter' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/NHSNumberFormatter' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/DateConstants' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/SampleEmptyStates' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/locationChange' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/ActionTypes' {
  export const RESET_PATIENT_SEARCH_FORM_STATE: string
  export const PATIENT_CHANGED: string
  export const PATIENT_UPDATED: string
  export const CLEAR_PATIENT_SEARCH_DATA: string
  export const CLEAR_ALL_NON_USER_DATA: string
  export const NHS_NUMBER_SEARCH_REQUESTED: string
  export const NHS_NUMBER_SEARCH_FAILED: string
}

declare module 'ncrs-host/QueryTypes' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/QueryBuilder' {
  const mod: any
  export = mod
}

declare module 'ncrs-host/HttpClient' {
  export const ncrsFetch: typeof fetch
}

declare module 'ncrs-host/NavigationActions' {
  export function navigateToSearchResultsAction(): any
  export function navigateToAdvancedSearchAction(): any
  export function navigateToPostcodeSearchAction(): any
  export function navigateToBasicSearchAction(): any
}

declare module 'ncrs-host/TabActionCreator' {
  export function activateBasicSearchTab(): any
  export function activateAdvancedSearchTab(): any
  export function activatePostcodeSearchTab(): any
}

declare module 'ncrs-host/UrlConfig' {
  const urlConfig: {
    basic_search_url: string
    advanced_search_url: string
    postcode_search_url: string
    [key: string]: any
  }
  export default urlConfig
}
