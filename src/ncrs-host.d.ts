// Type declarations for federated modules from ncrs-host
// These modules are loaded at runtime via module federation
//
// Modules with specific declarations below get proper types.
// All other ncrs-host/* modules fall through to the wildcard.
declare module 'ncrs-host/*';

// --- DateFormatter ---
// Source: src/js/presentation/formatters/DateFormatter.ts
declare module 'ncrs-host/DateFormatter' {
  export function spineDateToDisplayDate(spineDate: string | undefined, returnInvalidDate?: boolean, dateFormat?: string): string
  export function spineDateTimeToDisplayDateTime(spineDate: string | undefined, returnInvalidDate?: boolean, dateFormat?: string): string
  export function spineTimeToDisplayTime(spineTime: string | undefined, returnInvalidTime?: boolean, returnNotRecorded?: boolean): string
  export function formatFhirDate(fhirDate: string, returnInvalidDate?: boolean): string
  export function formatSpineDateToIsoDate(date: string): string
  export function getBlankDate(): { day: string; month: string; year: string }
  export function splitSpineDate(spineDate?: string | { day: string; month: string; year: string }): { day: string; month: string; year: string }
  export function datePartsToSpineDate(date?: { day: string; month: string; year: string }): string
  export function datePartsToDateObject(date: { day: string; month: string; year: string }): Date
  export function partialDatePartsToDateObject(date: { day: string; month: string; year: string }, fromOrToDate: 'from' | 'to'): Date
  export function datePartsToDateCastIsCoerced(dateParts: { day: string; month: string; year: string }): boolean
  export function datePartsToDatePartValues(dateParts: { day: string; month: string; year: string }): { day: number; month: number; year: number }
  export function dateToDateParts(date: Date): { day: string; month: string; year: string }
  export function parseSpineDate(value: string): Date
  export function parseDisplayDate(value: string): Date
  export function isValidDate(value: Date): boolean
  export function isValidSingleInputDate(dateString: string): boolean
  export function toSpineDate(day: number | string, month: number | string, year: number | string): string
  export function sanitizeStringToNumber(input: string | number): number
  export function effective(fromDate?: string | undefined | null, toDate?: string | undefined | null): string
  export function yearsOldCalculator(spineDOB: string, spineDateOfDeath?: string): string
  export function dateOfBirthCalculator(age: number | string): string
  export function getDatePartsAsSingleInputString(date: { day: string; month: string; year: string }): string
  export function formatDate(dateStr: string, format: string): string
  export function formatDateParts(date: { day: string; month: string; year: string } | undefined): string
}

// --- CommonStrings ---
// Source: src/js/core/constants/uistrings/CommonStrings.ts
declare module 'ncrs-host/CommonStrings' {
  export const NOT_RECORDED: string
  export const NO_ADDITIONAL_DETAILS: string
  export const NOT_PROVIDED: string
  export const NOT_AVAILABLE: string
  export const NOT_APPLICABLE: string
  export const NOT_KNOWN: string
  export const UNAVAILABLE: string
  export const RESTRICTED: string
  export const GO_TO_TOP_BUTTON: string
  export const DATA_QUALITY_TOOLTIP_HOVER: string
  export const INVALID_DATE: string
  export const UNKNOWN_AGE: string
  export const USE_TODAYS_DATE: string
  export const SELECT_BUTTON_LABEL: string
  export const CURRENTLY_VIEWING: string
  export const SUMMARY_CARE_RECORD_LABEL: string
  export const SEARCH_BY: string
  export const EDIT: string
  export const SKIP_TO: string
  export const CHANGE: string
  export const YES: string
  export const NO: string
  export const VIEW_HISTORY: string
  export const SEPARATOR: string
  export const PRINT: string
}

// --- ModalActionCreator ---
// Source: src/js/redux/actions/ModalActionCreator.ts
declare module 'ncrs-host/ModalActionCreator' {
  import type { Action } from 'redux'
  export function createCloseModalAction(): Action
  export function createCloseModalAndCancelFetchAction(): Action[]
  export function createOpenBackNavigationModalAction(): Action
  export function createOpenUiIdleTimeoutModalAction(): Action
  export function createOpenUiMaxTimeoutModalAction(): Action
  export function createBackNavigationFromSpinnerAction(): Action
  export function createPatientNotFoundModalAction(): Action
  export function createRetrievalBlockedModalAction(responseDetails: any): Action
  export function createFindPatientConnectionWarningAction(): Action
}

// --- DateConstants ---
// Source: src/js/core/constants/DateConstants.ts
declare module 'ncrs-host/DateConstants' {
  export const SCR_EARLIEST_CREATION_DATE: number
  export const EARLIEST_DOB_YEAR: number
  export const EARLIEST_DOB_INTERVAL: number
  export const LATEST_EFFECTIVE_INTERVAL: number
  export const DISPLAY_DATE_FORMAT: string
  export const DISPLAY_DATETIME_FORMAT: string
  export const SPINE_DATE_FORMAT: string
  export const SPINE_DATETIME_FORMAT: string
  export const ISO_DATE_FORMAT: string
  export const MONTH_NAMES: string[]
  export const MONTH_LOOKUPS: Record<string, string>
  export enum DateInputMethods {
    SingleDate = 'singleDate',
    DateRange = 'dateRange',
    AgeRange = 'ageRange',
  }
  export const DATE_INPUT_SWITCHER_SWITCH_TEXT: string
  export const DATE_INPUT_SWITCHER_OR_TEXT: string
}

// --- CommonValidators ---
// Source: src/js/core/validators/CommonValidators.ts
declare module 'ncrs-host/CommonValidators' {
  export class CharacterValidator {
    pattern: RegExp
    field: string | undefined
    constructor(pattern: RegExp, field?: string)
    validate(value: string): string[]
  }
  export class PostcodeValidator {
    validate(value: string, lengthError?: string, formatError?: string, characterError?: string): string[]
  }
  export class SearchGenderValidator {
    validate(value: string, allowAllGenders: boolean): string[]
  }
  export class LengthValidator {
    max: number
    min: number
    constructor(options: { max: number; min?: number; fieldTooShort?: string; fieldTooLong?: string; field?: string | null; ignore?: RegExp | null })
    validate(value: string): string[]
  }
  export function isValidPostcode(input: string): boolean
  export function isValidSearchGender(input: string | number): boolean
  export function validateState(inputs: Record<string, any>): boolean
}

// --- DateHelper ---
// Source: src/js/core/helpers/DateHelper.ts
declare module 'ncrs-host/DateHelper' {
  export function isDateBlank(date?: { day: string; month: string; year: string }): boolean
  export function datePartsItemContainsNonNumberChars(date: { day: string; month: string; year: string }): boolean
  export function getDateRange(dateFrom?: { day: string; month: string; year: string }, dateTo?: { day: string; month: string; year: string }): any
  export function anyDatePartValuesNaN(datePartValues: { day: number; month: number; year: number }): boolean
  export function allDatePartValuesNaN(datePartValues: { day: number; month: number; year: number }): boolean
  export function allDatePartsAreNilOrEmpty(dateParts: { day: string; month: string; year: string }): boolean
  export function anyDatePartsAreNilOrEmpty(dateParts: { day: string; month: string; year: string }): boolean
  export function isOutOfRange(date: Date, range?: number | { min: number; max: number }): boolean
  export function isFutureYear(year: number): boolean
  export function isCurrentYear(year: number): boolean
  export function getCurrentDateAsDateParts(): { day: string; month: string; year: string }
  export function isDateRangeInverted(dateFrom: { day: string; month: string; year: string }, dateTo: { day: string; month: string; year: string }): boolean
  export function parseSingleDateInput(input: string, isExactDateOnly?: boolean, inputType?: string): any
  export function getDateInputSwitcherInputIds(formId: string, fieldType: string, currentMethod: string): string[]
  export function getDateInputMethodsComparisons(methodToCompare: string): boolean[]
}

// --- BirthNotificationResultsStrings ---
// Source: src/js/core/constants/uistrings/bna/BirthNotificationResultsStrings.ts
declare module 'ncrs-host/BirthNotificationResultsStrings' {
  export const BIRTH_NOTIFICATION_RESULTS_TITLE: string
  export const MOTHERS_NAME: string
  export const MOTHERS_NHS_NUMBER: string
  export const MOTHERS_DOB: string
  export const BABY_GENDER: string
  export const BABY_NHS_NUMBER: string
  export const BABY_DOB: string
  export const BABY_FIRST_NAME: string
  export const NOTIFIED_DATE: string
  export const SEARCH_LIST: string
  export const CLEAR_SEARCH: string
  export const SORT_ASC: string
  export const SORT_DESC: string
  export const SORT_CLEAR: string
  export const NO_MATCH: string
}

// --- SpineVocabulary ---
// Source: src/js/core/constants/vocabulary/SpineVocabulary.ts
declare module 'ncrs-host/SpineVocabulary' {
  export const NO_PRIMARY_CARE_PROVIDER_CODE: string
  export const NO_PRIMARY_CARE_PROVIDER_NAME: string
  export const CONTACT_DETAIL_TEMPORARY: string
  export const UK_INTERNAL_COUNTRY_CODES_KEY: string
  export const UK_INTERNAL_COUNTRY_CODES: Record<string, string>
  export const INTERPRETER_REQUIRED_CODES: Record<string, string>
  export const RELATIONSHIP_CLASS_CODES: Record<string, string>
  export const RELATIONSHIP_TYPE_CODES: Record<string, string>
  export const COUNTIES_LIST: string[]
  export enum DataQualityReason {
    PotentialConfusion = '1',
    PotentialDuplicate = '2',
    UnderInvestigation = '3',
  }
}

// --- GenericHelpers ---
// Source: src/js/core/helpers/GenericHelpers.ts
declare module 'ncrs-host/GenericHelpers' {
  export function isEmpty(obj?: any): boolean
  export function isObjectEmpty(obj: any | undefined): boolean
  export function isObjectEqual(obj1: object, obj2: object): boolean
  export function isNotRecorded(input?: any): boolean
  export function flattenArray(input: any[]): any[]
  export function safeGetArray(key: string, source: any): any[]
  export function safeGetValue(key: string, source: any): string
  export function asBool(input: string): boolean
  export function nhsNumberWithoutWhitespace(input: string | number): string
  export function stripSurroundingQuotes(input: string): string
  export function fixSmartQuotes(values: string): string
  export function normaliseWhitespace(input: string): string
  export function trimStringsInObject(obj: any): any
  export function ordinalSuffix(i: number | string): string
}

// --- GenderFormatter ---
// Source: src/js/presentation/formatters/GenderFormatter.ts
declare module 'ncrs-host/GenderFormatter' {
  export function formatGender(input: string | number | undefined | null): string
}

// --- QueryTypes ---
// Source: src/js/core/constants/internals/QueryTypes.ts
declare module 'ncrs-host/QueryTypes' {
  export const BASIC: string
  export const ADVANCED: string
  export const POSTCODE: string
}

// --- SmallComponents ---
// Source: src/js/presentation/components/SmallComponents.tsx
declare module 'ncrs-host/SmallComponents' {
  import React from 'react'
  export class SmallRadios extends React.Component<any, any> {}
  export class SmallCheckboxes extends React.Component<any, any> {}
}

// --- NHSNumberFormatter ---
// Source: src/js/presentation/formatters/NHSNumberFormatter.ts
declare module 'ncrs-host/NHSNumberFormatter' {
  export function formatNHSNumber(nhsNumber: string | number): string
}

// --- NameFormatter ---
// Source: src/js/presentation/formatters/NameFormatter.ts
declare module 'ncrs-host/NameFormatter' {
  export function formatNameToTitleCase(name: any): string
  export function formatNameToUppercase(name: any): string
  export function formatName(spineName: any, format?: string): string
  export function formatSimpleName(spineName: any): string
  export function formatRecordedName(spineName: any): string
  export function formatPrefix(prefix?: any): string | undefined
  export function formatGpName(gpTitle?: string, gpFirstName?: string, gpMiddleNames?: string, gpSurname?: string): string
  export function formatPreferredName(preferredName: any, usualName: any): string
}

// --- QueryResultsHelper ---
// Source: src/js/core/helpers/QueryResultsHelper.ts
declare module 'ncrs-host/QueryResultsHelper' {
  export function evaluateAlphabeticalItems(item1: any, item2: any, scale?: number): number
  export function sortByLastName(results: any[], scale?: number): any[]
  export function sortByDob(results: any[], scale?: number): any[]
  export function sortByPostcode(results: any[], scale?: number): any[]
  export function sortByNhsNumber(results: any[]): any[]
  export function sortByMatchingLevel(results: any[]): any[]
}

// --- GenericStrings ---
// Source: src/js/core/constants/uistrings/pdsedit/GenericStrings.ts
declare module 'ncrs-host/GenericStrings' {
  export const CLEAR: string
  export const RESET: string
}

// --- ValidationRegExps ---
// Source: src/js/core/constants/ValidationRegExps.ts
declare module 'ncrs-host/ValidationRegExps' {
  export const REGEX_VALID_NHS_NUMBER: RegExp
  export const REGEX_VALID_CHARACTERS: RegExp
  export const REGEX_VALID_NAME: RegExp
  export const REGEX_VALID_ADDRESS: RegExp
  export const REGEX_VALID_TOWN: RegExp
  export const REGEX_INT_ONLY: RegExp
  export const REGEX_VALID_POST_CODE: RegExp
  export const REGEX_VALID_POST_CODE_CHARACTERS: RegExp
  export const REGEX_VALID_GENDER_SEARCH_CODE: RegExp
  export const REGEX_VALID_PHONE_NUMBER: RegExp
  export const REGEX_VALID_EMAIL: RegExp
}

// --- ValidationMessageStrings ---
// Source: src/js/core/constants/uistrings/ValidationMessageStrings.ts
declare module 'ncrs-host/ValidationMessageStrings' {
  export const VALIDATION_DATE_OUT_OF_RANGE: string
  export const VALIDATION_INVALID_CHARACTERS: string
  export const VALIDATION_INVALID_DATE_FORMAT: string
  export const VALIDATION_INVALID_FORMAT: string
  export const VALIDATION_INVALID_POSTCODE_LENGTH: string
  export const VALIDATION_NHS_NUMBER: string
  export const VALIDATION_MAXIMUM_CHARACTER_LENGTH: string
  export const VALIDATION_MINIMUM_CHARACTER_LENGTH: string
  export const VALIDATION_NOT_ON_ALLOW_LIST: string
  export const VALIDATION_WORDS_TOO_LONG: string
  export const VALIDATION_INVALID_DATE_RANGE: string
  export const VALIDATION_INVALID_PAST_DATE: string
  export const VALIDATION_INVALID_DATE: string
  export const VALIDATION_INVALID_FUTURE_DATE_LESS_THAN_150_YEARS: string
  export const VALIDATION_INVALID_PAST_DATE_LESS_THAN_150_YEARS: string
}

// --- PostCodeFormatter ---
// Source: src/js/presentation/formatters/PostCodeFormatter.ts
declare module 'ncrs-host/PostCodeFormatter' {
  export function formatPostcode(postcode: string): string
}

// --- PaginationControls ---
// Source: src/js/presentation/components/tables/PaginationControls.tsx
declare module 'ncrs-host/PaginationControls' {
  import React from 'react'
  const PaginationControls: React.ComponentType<any>
  export default PaginationControls
}

// --- Sentinel ---
// Source: src/js/presentation/components/Sentinel.tsx
declare module 'ncrs-host/Sentinel' {
  import React from 'react'
  const Sentinel: React.ComponentType<any>
  export default Sentinel
}

// --- TopButton ---
// Source: src/js/presentation/components/TopButton.tsx
declare module 'ncrs-host/TopButton' {
  import React from 'react'
  const TopButton: React.ComponentType<any>
  export default TopButton
}

// --- LogTransactions ---
// Source: src/js/core/constants/internals/LogTransactions.ts
declare module 'ncrs-host/LogTransactions' {
  export const viewSearchResults: string
}

// --- LogActionCreator ---
// Source: src/js/redux/actions/LogActionCreator.ts
declare module 'ncrs-host/LogActionCreator' {
  export function logTransaction(transaction: string): any
}

// --- NhsNumberQueryActionCreator ---
// Source: src/js/redux/actions/patientsearch/NhsNumberQueryActionCreator.ts
declare module 'ncrs-host/NhsNumberQueryActionCreator' {
  export function nhsNumberSearch(nhsNumber: string): any
}

// --- SaveQueryActionCreator ---
// Source: src/js/redux/actions/patientsearch/SaveQueryActionCreator.ts
declare module 'ncrs-host/SaveQueryActionCreator' {
  export function updateFormState(update: any): any
}

// --- locationChange ---
// Source: src/js/redux/reducers/locationChange.ts
declare module 'ncrs-host/locationChange' {
  export function clearStateOnRequest(payload: any, key: string, currentState: any, initialState: any): any
  export const KEEP_SEARCH_RESULTS: string
  export const KEEP_QUERY: string
  export const KEEP_SEARCH_FORM: string
  export const KEEP_PATIENT: string
}

// --- QueryBuilder ---
// Source: src/js/redux/reducers/stateBuilders/QueryBuilder.ts
declare module 'ncrs-host/QueryBuilder' {
  export function buildQueryResults(response: any): any
  export function buildQueryArguments(state: any, requestId?: string): any
  export function buildPostcodeSearchArguments(state: any, requestId?: string): any
}

// --- SampleEmptyStates ---
// Source: src/js/test/sampleEmptyStates.ts
declare module 'ncrs-host/SampleEmptyStates' {
  export function getEmptyDateParts(): { day: string; month: string; year: string }
}

// --- IdConstants ---
// Source: src/js/core/constants/idattributes/IdConstants.ts
declare module 'ncrs-host/IdConstants' {
  export const ERROR_PAGE_BODY_ID: string
  export const SET_TODAY_ID: string
  export const LABEL: string
  export const POSTCODE_SEARCH_CLEAR_BUTTON_ID: string
  export const NOTICE_TITLE_ID: string
  export const NOTICE_SUBTITLE_ID: string
  export const SECTION_1_ID: string
  export const SECTION_2_ID: string
  export const SECTION_3_ID: string
  export const SECTION_SUMMARY_ID: string
  export const PRIVACY_NOTICE_ID: string
  export const YOUR_RIGHTS_ID: string
  export const CONTACTS_ID: string
  export const AGREEMENT_ID: string
  export const REFERENCES_ID: string
  export const REF_1_ID: string
  export const REF_2_ID: string
  export const REF_3_ID: string
  export const REF_4_ID: string
  export const REF_5_ID: string
  export const REF_6_ID: string
  export const RESEARCH_PLANNING_FORM_GROUP_ID: string
  export const NDOP_UPDATE_FORM_RESEARCH_PLANNING_ID: string
  export const PATIENT_PROXY_FORM_GROUP_ID: string
  export const NDOP_UPDATE_FORM_PATIENT_PROXY_ID: string
  export const NDOP_UPDATE_FORM_PATIENT_PROXY_BEHALF_DETAILS_ID: string
  export const NDOP_UPDATE_BEHALF_DETAILS_ERROR_MESSAGE_ID: string
  export const NDOP_UPDATE_FORM_PATIENT_PROXY_GUARDIAN_ID: string
  export const NDOP_UPDATE_FORM_PATIENT_PROXY_POA_ID: string
  export const NDOP_UPDATE_FORM_PATIENT_PROXY_CAD_ID: string
  export const REFINE_LINK_ID: string
  export const ALLOCATE_NHS_NUMBER_LINK_ID: string
  export const SCR_SEARCH_ID: string
  export const SCR_SEARCH_TITLE_ID: string
  export const SCR_SEARCH_INPUT_ID: string
  export const SCR_SEARCH_CLEAR_FIELD_ID: string
  export const SIDEBAR_HEADER_ID: string
  export const SIDEBAR_CONTENT_ID: string
  export const LOADING_SPINNER_ID: string
  export const BANNER_LOADING_SPINNER_ID: string
  export const GP_CONNECT_DOCUMENT_LOADING_SPINNER_ID: string
  export const TOP_BUTTON_ID: string
  export const CPIS_ACTION_LINK_ID: string
  export const DASHBOARD_DOCUMENTS_RELOAD_ID: string
  export const DASHBOARD_DOCUMENTS_VIEW_LINK_ID: string
  export const DASHBOARD_DOCUMENTS_SCR_TEXT_ID: string
  export const DASHBOARD_DOCUMENTS_SCR_LINK_ID: string
  export const EDIT_ADDRESS_FORM_ERRORS_ID: string
  export const PDS_EDIT_KD_ADD_DEATH_ID: string
  export const OS_PLACES_ERRORS_ID: string
  export const OS_PLACES_SEARCH_INPUT: string
  export const OS_PLACES_SEARCH_APPLY: string
  export const ACCESS_MANAGEMENT_NO_ID: string
  export const ACCESS_MANAGEMENT_EMERGENCY_ID: string
  export const ACCESS_MANAGEMENT_LEGAL_ID: string
  export const ACCESS_MANAGEMENT_OFFLINE_ID: string
  export const NAVIGATION_LEAVE_LINK_ID: string
  export const NAVIGATION_STAY_LINK_ID: string
  export const CLOSE_CHANGE_ROLE_FAILED_ID: string
  export const SCR_EMERGENCY_ACCESS_EXPLANATION_ID: string
  export const SCR_ACCESS_REASON_INPUT_ID: string
  export const EMERGENCY_ACCESS_CONTINUE_ID: string
  export const EMERGENCY_ACCESS_CANCEL_ID: string
  export const SCR_LEGAL_OVERRIDE_EXPLANATION_ID: string
  export const LEGAL_OVERRIDE_ID: string
  export const LEGAL_ACCESS_CONTINUE_ID: string
  export const LEGAL_ACCESS_CANCEL_ID: string
  export const CLOSED_MESSAGE_ACTION_BUTTON_ID: string
  export const NOT_FOUND_RETURN_LINK_ID: string
  export const SCR_YES_ACCESS_EXPLANATION_ID: string
  export const ACCESS_MANAGEMENT_YES_ID: string
  export const ADD_SUPPORTING_INFO_ID: string
  export const SCR_SUPPORTING_INFORMATION_ID: string
  export const CNOK_SUBNAV_KEY: string
  export const CNOK_SUBNAV_ID: string
  export const CONTACT_NEXT_OF_KIN_PANEL_ID: string
  export const CONTACTS_AND_NEXT_OF_KIN_ID: string
  export const CONTACT_NEXT_OF_KIN_NHS_NUMBER: string
  export const DASHBOARD_DEMOGRAPHICS_TILE_ID: string
  export const DASHBOARD_DEMOGRAPHICS_LINK_ID: string
  export const DASHBOARD_REASONABLE_ADJUSTMENTS_LINK_ID: string
  export const DASHBOARD_DEMOGRAPHICS_NDOP_LINK_ID: string
  export const DASHBOARD_DEMOGRAPHICS_CPIS_LINK_ID: string
  export const DASHBOARD_DEMOGRAPHICS_FGM_LINK_ID: string
  export const DASHBOARD_DEMOGRAPHICS_BNA_LINK_ID: string
  export const DASHBOARD_DEMOGRAPHICS_CHARGEABLE_STATUS_LINK_ID: string
  export const DASHBOARD_CLINICALS_TILE_ID: string
  export const DASHBOARD_DOCUMENTS_TILE_ID: string
  export const CPIS_DATA_ID: string
  export const GP_CARE_PROVIDERS: string
  export const KEY_DEMOGRAPHIC: string
  export const RETURN_TO_DOCUMENTS_LIST_LINK_ID: string
  export const NRL_POINTER_ERROR_ID: string
  export const NRL_POINTER_REFERENCE_ID: string
  export const NRL_HEADING_ID: string
  export const GPCP_SUBNAV_KEY: string
  export const GPCP_SUBNAV_ID: string
  export const PRACTICE_PANEL_ID: string
  export const NO_GPS_AT_PRACTICE_ID: string
  export const GP_LIST_PANEL_ID: string
  export const GP_LIST_PANEL_NAMES: string
  export const GP_LIST_PANEL_GP_CODE: string
  export const GP_LIST_PANEL_GMC_CODE: string
  export const GP_LIST_PANEL_COPY: string
  export const NO_NOMINATED_PHARMACY_ID: string
  export const NOMINATED_PHARMACY_PANEL_ID: string
  export const NO_DISPENSING_DOCTOR_ID: string
  export const DISPENSING_DOCTOR_PANEL_ID: string
  export const NO_MEDICAL_APPLIANCE_ID: string
  export const MEDICAL_APPLIANCE_PANEL_ID: string
  export const KD_SUBNAV_ID: string
  export const KD_SUBNAV_KEY: string
  export const NAME_PANEL_ID: string
  export const KEY_DETAILS_PANEL_ID: string
  export const KEY_DETAILS_GP_PRACTICE_NAME: string
  export const KEY_DETAILS_GP_PRACTICE_ADDRESS: string
  export const KEY_DETAILS_GP_COMMISSIONING_ORG: string
  export const KEY_DETAILS_GP_PRACTICE_LINK: string
  export const ADDRESS_PANEL_ID: string
  export const CONTACT_DETAILS_PANEL_ID: string
  export const NO_CONTACT_DETAILS_ID: string
  export const VIEW_HISTORY_ID: string
  export const GP_CONNECT_ATTACHMENTS_ID: string
  export const ACCESS_DOCUMENTS_PANEL_ID: string
  export const ACCESS_DOCUMENTS_SHOW_ALL_ID: string
  export const ACCESS_DOCUMENTS_CLEAR_SEARCH_LINK_ID: string
  export const ACCESS_DOCUMENTS_CLEAR_FILTER_ID: string
  export const ACCESS_DOCUMENTS_TABLE_FILTER_ATTACHMENTS_LABEL_ID: string
  export const ACCESS_DOCUMENTS_TABLE_SEARCH_FILTER_ID: string
  export const GP_CONNECT_ACCESS_DOCUMENTS_RETRY_BUTTON_ID: string
  export const GP_CONNECT_ACCESS_DOCUMENTS_ERROR_INSET_ID: string
  export const GP_CONNECT_ACCESS_DOCUMENTS_ERROR_INTERNAL_ID_ID: string
  export const NDOP_NOT_EMPTY_PANEL_ID: string
  export const NDOP_CONSENT_VALUE_ID: string
  export const UPDATE_NDOP_PREFERENCE_LINK_ID: string
  export const NDOP_PROXY_USED_ID: string
  export const NDOP_EMPTY_PANEL_ID: string
  export const NDOP_EMPTY_DECEASED_ID: string
  export const NDOP_EMPTY_SENSITIVE_ID: string
  export const NDOP_UPDATE_VIEW_FORM_ID: string
  export const ASSOCIATED_REF_FORM_GROUP_ID: string
  export const NDOP_UPDATED_FORM_ASSOCIATED_REF_ID: string
  export const PATIENT_NDOP_UPDATE_CONFIRM_PREFERENCE_ID: string
  export const PATIENT_NDOP_UPDATE_CANCEL_CLICK_ID: string
  export const ERROR_SUMMARY_ID: string
  export const ERROR_SUMMARY_TITLE_ID: string
  export const RESEARCH_PLANNING_ID: string
  export const PATIENT_PROXY_ID: string
  export const PATIENT_PROXY_BEHALF_ID: string
  export const ASSOCIATED_REF_ID: string
  export const NAVIGATE_BACK_ID: string
  export const NDOP_DETAILS_ID: string
  export const RA_DETAILS_ID: string
  export const PATIENT_VIEW_SENTINEL_ID: string
  export const SCR_HEADER_ID: string
  export const SCR_FOOTER_ID: string
  export const SCR_PRINT_FOOTER_ID: string
  export const SCR_PRINT_FULL_ID: string
  export const SCR_PRINT_CORE_ID: string
  export const ADJUSTMENT_LIST_SECTION_MENU_ID: string
  export const CANCEL_RA_SPLASH_TAB_ID: string
  export const FOOTER_USER_DETAILS_ID: string
  export const ACCESSIBILITY_ID: string
  export const PRIVACY_AND_COOKIES_ID: string
  export const TERMS_AND_CONDITIONS_ID: string
  export const HELP_AND_GUIDANCE_ID: string
  export const ACCESSIBILITY_TEXT_TOGGLE_ID: string
  export const MASTHEAD_FIND_PATIENT_BTN_ID: string
  export const MASTHEAD_LIST_BIRTH_NOTIFICATIONS_BTN_ID: string
  export const MASTHEAD_CHANGE_ROLE_BTN_ID: string
  export const MASTHEAD_USER_FEEDBACK_BTN_ID: string
  export const MASTHEAD_WHATS_NEW_BTN_ID: string
  export const MASTHEAD_USER_SETTINGS_BTN_ID: string
  export const MASTHEAD_LOGOUT_BTN_ID: string
  export const MASTHEAD_RETURN_TO_RESULTS_BTN_ID: string
  export const SUMMARY_NAME_ID: string
  export const SUMMARY_PREFERRED_NAME: string
  export const SUMMARY_AGE_ID: string
  export const SUMMARY_GENDER_ID: string
  export const SUMMARY_AGE_AND_GENDER: string
  export const SUMMARY_DOB_ID: string
  export const SUMMARY_ADDRESS_ID: string
  export const SUMMARY_NHS_NUMBER_ID: string
  export const SUMMARY_DECEASED_ID: string
  export const SUMMARY_DEATH_STATUS_ID: string
  export const SUMMARY_DOD_ID: string
  export const PATIENT_DASHBOARD_NAVIGATION_TAB_ID: string
  export const PATIENT_DEMOGRAPHICS_NAVIGATION_TAB_ID: string
  export const PATIENT_CLINICALS_NAVIGATION_TAB_ID: string
  export const PATIENT_DOCUMENTS_NAVIGATION_TAB_ID: string
  export const PATIENT_GP_CONNECT_NAVIGATION_TAB_ID: string
  export const ADVANCED_SEARCH_FORM_ID: string
  export const GENDER_FORM_GROUP_ID: string
  export const ADVANCED_SEARCH_FORM_GENDER_ID: string
  export const ADVANCED_SEARCH_FORM_GENDER_LABEL_ID: string
  export const GENDER_SEARCH_ALL_WARNING_ID: string
  export const NAME_FORM_GROUP_ID: string
  export const ADVANCED_SEARCH_FORM_FIRST_NAME_ID: string
  export const ADVANCED_SEARCH_FORM_SURNAME_ID: string
  export const ADVANCED_SEARCH_FORM_ALGORITHMIC_ID: string
  export const ADVANCED_SEARCH_FORM_POSTCODE_ID: string
  export const ADVANCED_SEARCH_FORM_INCLUDE_DOD_ID: string
  export const ADVANCED_SEARCH_CLEAR_BUTTON_ID: string
  export const BASIC_SEARCH_FORM_ID: string
  export const BASIC_SEARCH_FORM_GENDER_ID: string
  export const BASIC_SEARCH_FORM_GENDER_LABEL_ID: string
  export const BASIC_SEARCH_FORM_SURNAME_ID: string
  export const BASIC_SEARCH_FORM_DOB_ID: string
  export const BASIC_SEARCH_CLEAR_BUTTON_ID: string
  export const NHS_NUMBER_SEARCH_TAB_ID: string
  export const BASIC_SEARCH_TAB_ID: string
  export const ADVANCED_SEARCH_TAB_ID: string
  export const POSTCODE_SEARCH_TAB_ID: string
  export const NHS_NUMBER: string
  export const NHS_NUMBER_HINT_ID: string
  export const NHS_NUMBER_SEARCH_FORM_NHS_NUMBER_ID: string
  export const NHS_NUMBER_SUBMIT_ID: string
  export const POSTCODE_SEARCH_FORM_ID: string
  export const POSTCODE_FORM_GROUP_ID: string
  export const POSTCODE_SEARCH_HINT_ID: string
  export const POSTCODE_SUBMIT_ID: string
  export const POSTCODE_SEARCH_FORM_POSTCODE_ID: string
  export const POSTCODE_SEARCH_FORM_EFFECTIVE_RANGE_ID: string
  export const POSTCODE_SEARCH_FORM_FIRST_NAME_ID: string
  export const POSTCODE_SEARCH_FORM_SURNAME_ID: string
  export const POSTCODE_SEARCH_FORM_INCLUDE_PREVIOUS_OCCUPANTS_ID: string
  export const QUERY_SUMMARY_ID: string
  export const RESULTS_HEADER_ID: string
  export const RESULTS_FILTER_SEARCH_ID: string
  export const RESULTS_FILTER_SEARCH_LABEL_ID: string
  export const RESULTS_FILTER_GENDER_ID: string
  export const RESULTS_FILTER_GENDER_LABEL_ID: string
  export const RESULTS_FILTER_CHECKBOXES: string
  export const RESULTS_FILTER_CHECKBOXES_LABEL_ID: string
  export const RESULTS_LAST_NAME_FIRST_ID: string
  export const RESULTS_DECEASED_SORT_ID: string
  export const RESULTS_FILTER_CLEAR_ID: string
  export const CURRENT_ROLE_DETAILS_ID: string
  export const CURRENT_ROLE_DETAILS_NONE_SELECTED_ID: string
  export const RETURN_TO_FIND_PATIENT_LINK_ID: string
  export const SELECT_ROLE_HEADER_ID: string
  export const ALLOWED_ROLES_ID: string
  export const SELECTED_SITE_TABLE_ID: string
  export const CHANGE_SITE_ID: string
  export const ROLE_CONFIRMED: string
  export const ROLE_CONFIRMED_HEADER_ID: string
  export const CHANGE_ORG_ID: string
  export const CHANGE_ROLE_ID: string
  export const CONFIRM_CURRENT_ROLE_ID: string
  export const RESULTS_QUERY_TEXT_ID: string
  export const SELECT_SITE_HEADER_ID: string
  export const SELECT_SITE_DESCRIPTION_ID: string
  export const ORGANISATION_SEARCH_FORM_SEARCH_FIELD_ID: string
  export const ORGANISATION_SEARCH_FORM_SEARCH_TYPE_FIELD_ID: string
  export const ORGANISATION_SEARCH_SUBMIT_ID: string
  export const FEMALE_GENITAL_MUTILATION_ID: string
  export const FGM_UPDATE_VIEW_FORM_ID: string
  export const PATIENT_FGM_UPDATE_SUBMIT_ID: string
  export const PATIENT_FGM_UPDATE_CANCEL_CLICK_ID: string
  export const FGM_UPDATE_FORM_DATE_ID: string
  export const FGM_UPDATE_FORM_DATE_LABEL_ID: string
  export const PATIENT_FGM_REMOVAL_CONFIRM_PREFERENCE_ID: string
  export const FGM_VIEW_ACTION_LINK_ID: string
  export const FGM_ADD_ACTION_LINK_ID: string
  export const FGM_REMOVE_VIEW_FORM_ID: string
  export const PATIENT_FGM_REMOVE_SUBMIT_ID: string
  export const PATIENT_FGM_REMOVE_CANCEL_CLICK_ID: string
  export const FGM_REMOVAL_FROM_REASON_ID: string
  export const BIRTH_NOTIFICATION_ID: string
  export const BNA_ACTION_LINK_ID: string
  export const REVIEW_SECTION_ID: string
  export const SUBMIT_USER_FEEDBACK_ID: string
  export const CANCEL_USER_FEEDBACK_ID: string
  export const FEEDBACK_ROLE_TEXT_AREA_ID: string
  export const APPLICATION_FEEDBACK_TEXT_AREA_ID: string
  export const EXPERIENCE_RATING_FEEDBACK_ID: string
  export const USE_FEEDBACK_TEXT_AREA_ID: string
  export const FEEDBACK_TOAST_ID: string
  export const PREFERRED_TAB_PREFERENCE_ID: string
  export const SAVE_USER_PREFERENCES_ID: string
  export const USER_PREFERENCES_TOAST_ID: string
  export const SEARCH_RESULTS_COUNT_ID: string
  export const CHARGEABLE_STATUS_SUBNAV_KEY: string
  export const CHARGEABLE_STATUS_SUBNAV_ID: string
  export const CHARGEABLE_STATUS_ID: string
  export const CHARGEABLE_STATUS_DETAILS_SECTION_ID: string
  export const CHARGEABLE_STATUS_DETAILS_CATEGORY_PANEL_ID: string
  export const CHARGEABLE_STATUS_PATIENT_DATA_SECTION_ID: string
  export const CHARGEABLE_STATUS_PATIENT_DATA_PANEL_ID: string
  export const CHARGEABLE_STATUS_ADDITIONAL_DATA_SECTION_ID: string
  export const CHARGEABLE_STATUS_PASSPORT_INFORMATION_PANEL_ID: string
  export const CHARGEABLE_STATUS_HOME_OFFICE_CONTACT_PANEL_ID: string
  export const CHARGEABLE_STATUS_ENTITLEMENT_EVIDENCE_SECTION_ID: string
  export const CHARGEABLE_STATUS_EHIC_PANEL_ID: string
  export const CHARGEABLE_STATUS_PRC_PANEL_ID: string
  export const CHARGEABLE_STATUS_s1_PANEL_ID: string
  export const CHARGEABLE_STATUS_s2_PANEL_ID: string
  export const COLUMN_LAYOUT_TOGGLE_ID: string
  export const PRINT_BUTTON_ID: string
  export const FLAGS_ALERTS_SUBNAV_KEY: string
  export const FLAGS_ALERTS_SUBNAV_ID: string
  export const FLAGS_ALERTS_ID: string
  export const HISTORICAL_INFO_SUBNAV_KEY: string
  export const HISTORICAL_INFO_SUBNAV_ID: string
  export const HISTORICAL_INFO_ID: string
  export const HISTORICAL_INFO_NAME_CARD_ID: string
  export const HISTORICAL_INFO_ADDRESS_CARD_ID: string
  export const HISTORICAL_INFO_CONTACT_CARD_ID: string
  export const HISTORICAL_INFO_GP_CARD_ID: string
  export const HISTORICAL_INFO_OTHER_CARE_PROVIDERS_CARD_ID: string
  export const WHATS_NEW_FEEDBACK_BUTTON_ID: string
  export const CALLOUT_PATIENT_FLAGS_API_RELOAD_LINK_ID: string
  export const CALLOUT_PATIENT_RETRIEVAL_ERROR_RELOAD_LINK_ID: string
}

// --- useSkipLink ---
// Source: src/js/core/hooks/UseSkipLink.ts
declare module 'ncrs-host/useSkipLink' {
  export const useSkipLink: (selector: string) => void
}

// --- AccessibilityHelpers ---
// Source: src/js/core/helpers/AccessibilityHelpers.ts
declare module 'ncrs-host/AccessibilityHelpers' {
  import { KeyboardEvent } from 'react'
  export const OnEnterPressed: <E extends HTMLElement>(
    functionToFire: (e: KeyboardEvent<E>) => void
  ) => (e: KeyboardEvent<E>) => void
  export const OnEnterPressedNewNav: <E extends HTMLElement>(
    functionToFire: ((e: KeyboardEvent<E>) => void) | string,
    navigate: Function
  ) => (e: KeyboardEvent<E>) => void
  export const SimulateClickEvent: (e: KeyboardEvent<HTMLElement>) => void
}

// --- BnaActionCreator ---
// Source: src/js/redux/actions/bna/BnaActionCreator.ts
declare module 'ncrs-host/BnaActionCreator' {
  import type { Action } from 'redux'
  export const navigateToBnaNotifierTab: () => Action
  export const navigateToBnaDeliveryPlaceTab: () => Action
  export const navigateToBnaMotherDetailsTab: () => Action
  export const navigateToBnaBabyBirthDetailsTab: () => Action
  export const navigateToBnaBabyAddressDetailsTab: () => Action
  export const navigateToBnaReviewAndSubmitTab: () => Action
  export const navigateToBnaErrorTab: () => Action
  export const navigateToBnaNotificationSuccessDetailsTab: () => Action
  export const navigateToBnaNotificationFailureTab: () => Action
  export const navigateToBnaNotificationExactDuplicateFoundErrorTab: () => Action
  export const navigateToBnaPrintLabelsTab: () => Action
  export const navigateToBnaListApplyFiltersTab: () => Action
  export const navigateToBirthNotificationSummaryTab: () => Action
  export const navigateToBirthNotificationsListTab: () => Action
  export const navigateToBnaPrintLabelsListTab: () => Action
  export const clearCreateBirthNotificationData: () => Action
  export const resetCreateBirthNotificationDataForNextBaby: () => Action
}

// --- NavigationActions ---
// Source: src/js/redux/actions/NavigationActions.ts
declare module 'ncrs-host/NavigationActions' {
  import type { Action } from 'redux'
  type NavigationType = 'PUSH' | 'REPLACE'
  export const navigateToPatientSearchAction: (type?: NavigationType) => Action | Action[]
  export const navigateToNhsNumberSearchAction: (type?: NavigationType) => Action | Action[]
  export const navigateToBasicSearchAction: (type?: NavigationType) => Action | Action[]
  export const navigateToAdvancedSearchAction: (type?: NavigationType) => Action | Action[]
  export const navigateToPostcodeSearchAction: (type?: NavigationType) => Action | Action[]
  export const navigateToChangeRoleSearchAction: (type?: NavigationType) => Action
  export const navigateToCreateBirthNotificationViewAction: (type?: NavigationType) => Action
  export const navigateToBirthNotificationListAction: (type?: NavigationType) => Action | Action[]
  export const navigateToSelectDispensingSiteAction: (type?: NavigationType) => Action
  export const navigateToRoleConfirmedAction: (type?: NavigationType) => Action
  export const navigateToSearchResultsAction: (type?: NavigationType) => Action
  export const navigateToPatientAction: (type?: NavigationType) => Action | Action[]
  export const navigateToPatientDemographicsAction: (type?: NavigationType) => Action | Action[]
  export const navigateToPatientRaAction: (type?: NavigationType) => Action | Action[]
  export const navigateToGDPRAccessibilityAction: (type?: NavigationType) => Action
  export const navigateToGDPRCookiesAction: (type?: NavigationType) => Action
  export const navigateToGDPRTermsAndConditionsAction: (type?: NavigationType) => Action
  export const navigateToErrorAction: (type?: NavigationType) => Action
  export const navigateToDemographicsAction: (type?: NavigationType) => Action | Action[]
  export const navigateToAllocateNhsViewAction: (type?: NavigationType) => Action | Action[]
}

// --- store ---
// Source: src/js/appStore.ts
declare module 'ncrs-host/store' {
  import type { TypedUseSelectorHook } from 'react-redux'
  export const useAppDispatch: () => (action: any) => any
  export const useAppSelector: TypedUseSelectorHook<any>
  export function addReducer(key: string, reducer: any): boolean
  export const history: any
  const store: any
  export default store
}

// --- PatientSearchResultsStrings ---
// Source: src/js/core/constants/uistrings/patientsearch/PatientSearchResultsStrings.ts
declare module 'ncrs-host/PatientSearchResultsStrings' {
  export const PSR_QUERY_HELP_ALLOCATE: string
  export const PSR_RESULT_COUNT_MULTIPLE: string
  export const PSR_RESULT_COUNT_SINGLE: string
  export const PSR_RESULT_COUNT_NONE: string
  export const PSR_RESULT_COUNT_OVER_MAX: string
  export const PSR_FILTER_SEARCH_LABEL: string
  export const RESULTS_FILTER_GENDER_LABEL: string
  export const RESULTS_FILTER_GENDER_ALL_LABEL: string
  export const RESULTS_FILTER_GENDER_MALE_LABEL: string
  export const RESULTS_FILTER_GENDER_FEMALE_LABEL: string
  export const HIDE_DECEASED_PATIENTS_LABEL: string
  export const LAST_NAME_FIRST_LABEL: string
  export const PRS_FILTER_COUNT: string
  export const GENDER_FILTER_VALUES: {
    male: string
    female: string
    all: string
  }
  export const PSR_RESULT_QUERY_GENDER: string
  export const PSR_RESULT_QUERY_FIRSTNAME: string
  export const PSR_RESULT_QUERY_SURNAME: string
  export const PSR_RESULT_QUERY_DOB: string
  export const PSR_RESULT_QUERY_DOB_RANGE: string
  export const PSR_RESULT_QUERY_DOD: string
  export const PSR_RESULT_QUERY_DOD_RANGE: string
  export const PSR_RESULT_QUERY_POSTCODE: string
  export const PSR_RESULT_QUERY_WIDEN: string
  export const PSR_RESULT_QUERY_OCCUPANCY: string
  export const PSR_RESULT_QUERY_CURRENT_OCCUPANTS_ONLY: string
  export const PSR_RESULT_QUERY_INCLUDE_PREVIOUS_OCCUPANTS: string
  export const PSR_RESULT_ROW_DQ_ISSUE: string
  export const PSR_RESULT_ROW_DECEASED: string
  export const PSR_RESULT_ROW_DATE_OF_DEATH: string
  export const PSR_ALLOCATE_NHS_NUMBER: string
  export const PSR_REFINE_START_AGAIN: string
  export const PSR_CREATE_BIRTH_NOTIFICATION: string
  export const PSR_SEARCH_TIPS_HEADER: string
  export const PSR_SEARCH_TIP_BASIC: string
  export const PSR_SEARCH_TIP_LAST_NAME_WILDCARD: string
  export const PSR_SEARCH_TIP_LAST_NAME_ONLY: string
  export const PSR_SEARCH_TIP_SINGLE_DOB__OR_GENDER: string
  export const PSR_SEARCH_TIP_REDUCE_DOB__OR_AGE_RANGE: string
  export const PSR_SEARCH_TIP_POSTCODE_WILDCARD: string
  export const PSR_SEARCH_TIP_PREVIOUS_OCCUPANTS: string
  export const PSR_SEARCH_TIP_RETRY: string
  export const PSR_SEARCH_TIP_SUGGEST_ADVANCED_SEARCH: string
  export const PSR_SEARCH_TIP_ADJUST_NUMBER_OF_RESULTS: string
  export const PSR_SEARCH_GUIDANCE: string
  export const PSR_TOO_MANY_RESULTS_LINK: string
  export const PATIENT_SEARCH_COUNT_ALL: number
  export const DEFAULT_SEARCH_RESULTS_COUNT: number
  export const PATIENT_SEARCH_ROW_COUNT_OPTIONS: number[]
  export const DOCUMENT_SEARCH_ROW_COUNT_OPTIONS: number[]
  export const PATIENT_SEARCH_ROW_COUNT_ALL: string
}

// --- AppStateTypes ---
// Source: src/js/core/types/AppStateTypes.d.ts
declare module 'ncrs-host/AppStateTypes' {
  export type PatientSearchQueryResults = any
  export type QueryArguments = any
  export type PostcodeSearchArguments = any
  export type PatientSearchResultsTableOptionsUpdate = any
  export type FindPatientStates = any
  export type SearchFormUpdate = any
  export type DateParts<T = string> = any
  export type AppState = any
  export type UserDetailsState = any
  export type SelectedSearchViewTab = any
  export type DateRange<T = any> = { from?: T; to?: T }
  export type SearchFormDateInputMethods = any
  export type Filters = any
  export type QueryResult = any
}

// --- ActionTypes ---
// Source: src/js/core/constants/internals/ActionTypes.ts
declare module 'ncrs-host/ActionTypes' {
  export const RESET_PATIENT_SEARCH_FORM_STATE: string
  export const PATIENT_CHANGED: string
  export const PATIENT_UPDATED: string
  export const CLEAR_PATIENT_SEARCH_DATA: string
  export const CLEAR_ALL_NON_USER_DATA: string
  export const NHS_NUMBER_SEARCH_REQUESTED: string
  export const NHS_NUMBER_SEARCH_FAILED: string
}

// --- HttpClient ---
// Source: src/js/redux/actions/HttpClient.ts
declare module 'ncrs-host/HttpClient' {
  export const ncrsFetch: typeof fetch
}

// --- TabActionCreator ---
// Source: src/js/redux/actions/TabActionCreator.ts
declare module 'ncrs-host/TabActionCreator' {
  import type { Action } from 'redux'
  export function activateBasicSearchTab(): Action
  export function activateAdvancedSearchTab(): Action
  export function activatePostcodeSearchTab(): Action
  export function activateNHSNumberSearchTab(): Action
  export function activateSelectedSearchTab(): Action
  export function activateDashboardTab(): Action
  export function activateDemographicsTab(): Action
  export function activateReasonableAdjustmentsTab(): Action
}

// --- UrlConfig ---
// Source: src/js/config/Config.ts
declare module 'ncrs-host/UrlConfig' {
  const urlConfig: {
    basic_search_url: string
    advanced_search_url: string
    postcode_search_url: string
    [key: string]: any
  }
  export default urlConfig
}
