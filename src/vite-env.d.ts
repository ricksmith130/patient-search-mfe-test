/// <reference types="vite/client" />

// Host module declarations for ncrs-host federation imports

// FindTabs constants
declare module "ncrs-host/findTabsConstants" {
    export const NHS_NUMBER_SEARCH: "NHS_NUMBER_SEARCH";
    export const BASIC_SEARCH: "BASIC_SEARCH";
    export const ADVANCED_SEARCH: "ADVANCED_SEARCH";
    export const POSTCODE_SEARCH: "POSTCODE_SEARCH";
}

// RefreshChecker
declare module "ncrs-host/initialiseRefreshCheck" {
    export const initialiseRefreshCheck: () => void;
}

// CommonHooks
declare module "ncrs-host/useAppState" {
    export const useAppState: <T>(selector: (state: any) => T) => T;
}

// UseSkipLink
declare module "ncrs-host/useSkipLink" {
    export const useSkipLink: (selector: string) => void;
}

// Browser Page Titles
declare module "ncrs-host/SearchTitles" {
    export const NHS_NUMBER_SEARCH_TITLE: string;
    export const BASIC_SEARCH_TITLE: string;
    export const ADVANCED_SEARCH_TITLE: string;
    export const POSTCODE_SEARCH_TITLE: string;
}

// PatientNotFoundStrings
declare module "ncrs-host/PatientNotFoundStrings" {
    export const NO_NHS_NUMBER_FOUND_BUTTON_TEXT: string;
    export const NO_NHS_NUMBER_FOUND_MESSAGE: string;
    export const NO_NHS_NUMBER_FOUND_TITLE: string;
    export const NHS_NUMBER_RETRIEVAL_BLOCKED_TITLE: string;
    export const NHS_NUMBER_RETRIEVAL_BLOCKED_DEFAULT: string;
}

// FindPatientStrings
declare module "ncrs-host/FindPatientStrings" {
    export const FIND_PATIENT_PAGE_HEADER: string;
    export const FIND_PATIENT_NHS_NUMBER: string;
    export const FIND_PATIENT_NHS_NUMBER_LABEL: string;
    export const FIND_PATIENT_BASIC_DETAILS: string;
    export const FIND_PATIENT_BASIC_DETAILS_LABEL: string;
    export const FIND_PATIENT_ADVANCED_DETAILS: string;
    export const FIND_PATIENT_ADVANCED_DETAILS_LABEL: string;
    export const FIND_PATIENT_POSTCODE: string;
    export const FIND_PATIENT_POSTCODE_LABEL: string;
    export const NHS_NUM_SEARCH_LABEL: string;
    export const NHS_NUM_SEARCH_EXAMPLE: string;
    export const NHS_NUM_SEARCH_FIND_A_PATIENT: string;
    export const NHS_NUM_SEARCH_TOO_SHORT: string;
    export const NHS_NUM_SEARCH_INVALID: string;
    export const BASIC_SEARCH_HEADER: string;
    export const BASIC_SEARCH_HINT: string;
    export const BASIC_SEARCH_FIND_A_PATIENT: string;
    export const PATIENT_SEARCH_GENDER_LABEL: string;
    export const PATIENT_SEARCH_GENDER_FEMALE_LABEL: string;
    export const PATIENT_SEARCH_GENDER_MALE_LABEL: string;
    export const PATIENT_SEARCH_GENDER_SEARCH_ALL_LABEL: string;
    export const PATIENT_SEARCH_GENDER_SEARCH_ALL_CONDITIONAL_TEXT: string;
    export const PATIENT_SEARCH_SURNAME_LABEL: string;
    export const PATIENT_SEARCH_FIRST_NAME_LABEL: string;
    export const PATIENT_SEARCH_DOB_LABEL: string;
    export const PATIENT_SEARCH_DOB_RANGE_LABEL: string;
    export const PATIENT_SEARCH_DOD_LABEL: string;
    export const PATIENT_SEARCH_DOD_RANGE_LABEL: string;
    export const PATIENT_SEARCH_POSTCODE_LABEL: string;
    export const PATIENT_SEARCH_DATE_FROM: string;
    export const PATIENT_SEARCH_DATE_TO: string;
    export const PATIENT_SEARCH_AGE_RANGE_FROM_LABEL: string;
    export const PATIENT_SEARCH_AGE_RANGE_TO_LABEL: string;
    export const PATIENT_SEARCH_WIDEN_LABEL: string;
    export const PATIENT_SEARCH_INCLUDE_DOD_LABEL: string;
    export const ADVANCED_SEARCH_HEADER: string;
    export const ADVANCED_SEARCH_HINT: string;
    export const ADVANCED_SEARCH_FIND_A_PATIENT: string;
    export const POSTCODE_SEARCH_HEADER: string;
    export const POSTCODE_SEARCH_HINT: string;
    export const POSTCODE_FIND_A_PATIENT: string;
    export const POSTCODE_SEARCH_POSTCODE_LABEL: string;
    export const POSTCODE_SEARCH_EFFECTIVE_RANGE_LABEL: string;
    export const POSTCODE_SEARCH_INCLUDE_PREVIOUS_OCCUPANTS: string;
}

// Bulletins component
declare module "ncrs-host/Bulletins" {
    const Bulletins: React.FC;
    export default Bulletins;
}

// Modal components
declare module "ncrs-host/FindPatientConnectionWarning" {
    const FindPatientConnectionWarning: React.FC;
    export default FindPatientConnectionWarning;
}

declare module "ncrs-host/PatientNotFound" {
    const PatientNotFound: React.FC;
    export default PatientNotFound;
}

declare module "ncrs-host/PatientRetrievalBlocked" {
    const PatientRetrievalBlocked: React.FC<{ returnButtonText: string }>;
    export default PatientRetrievalBlocked;
}

// AppStateTypes
declare module "ncrs-host/AppStateTypes" {
    export type SelectedSearchViewTab = "NHS_NUMBER_SEARCH" | "BASIC_SEARCH" | "ADVANCED_SEARCH" | "POSTCODE_SEARCH";
    export type DateParts<T> = { day: T; month: T; year: T };
    export type FindPatientStates = any;
    export type QueryArguments = any;
    export type SearchFormUpdate = any;
    export type OSPlacesLookupResult = any;
    export type PostcodeSearchArguments = any;
    export type IgnoreHistoryIndicatorType = "0" | "1";
}

// BasicTypes
declare module "ncrs-host/BasicTypes" {
    export type InputData<T> = { value: T; validationErrorReason: string };
    export type InputDataWithComponentValidation<T> = InputData<T> & { componentValidationErrorReason?: string };
}

// IdConstants
declare module "ncrs-host/IdConstants" {
    export const NHS_NUMBER_SEARCH_TAB_ID: string;
    export const BASIC_SEARCH_TAB_ID: string;
    export const ADVANCED_SEARCH_TAB_ID: string;
    export const POSTCODE_SEARCH_TAB_ID: string;
    export const NHS_NUMBER_SEARCH_FORM_NHS_NUMBER_ID: string;
    export const NHS_NUMBER_HINT_ID: string;
    export const NHS_NUMBER_SUBMIT_ID: string;
    export const BASIC_SEARCH_FORM_ID: string;
    export const BASIC_SEARCH_FORM_GENDER_ID: string;
    export const BASIC_SEARCH_FORM_GENDER_LABEL_ID: string;
    export const BASIC_SEARCH_FORM_SURNAME_ID: string;
    export const BASIC_SEARCH_FORM_DOB_ID: string;
    export const BASIC_SEARCH_CLEAR_BUTTON_ID: string;
    export const ADVANCED_SEARCH_FORM_ID: string;
    export const ADVANCED_SEARCH_FORM_GENDER_ID: string;
    export const ADVANCED_SEARCH_FORM_GENDER_LABEL_ID: string;
    export const ADVANCED_SEARCH_FORM_FIRST_NAME_ID: string;
    export const ADVANCED_SEARCH_FORM_SURNAME_ID: string;
    export const ADVANCED_SEARCH_FORM_POSTCODE_ID: string;
    export const ADVANCED_SEARCH_FORM_ALGORITHMIC_ID: string;
    export const ADVANCED_SEARCH_FORM_INCLUDE_DOD_ID: string;
    export const ADVANCED_SEARCH_CLEAR_BUTTON_ID: string;
    export const GENDER_FORM_GROUP_ID: string;
    export const GENDER_SEARCH_ALL_WARNING_ID: string;
    export const NAME_FORM_GROUP_ID: string;
    export const POSTCODE_FORM_GROUP_ID: string;
    export const POSTCODE_SEARCH_FORM_ID: string;
    export const POSTCODE_SEARCH_FORM_POSTCODE_ID: string;
    export const POSTCODE_SEARCH_FORM_FIRST_NAME_ID: string;
    export const POSTCODE_SEARCH_FORM_SURNAME_ID: string;
    export const POSTCODE_SEARCH_FORM_EFFECTIVE_RANGE_ID: string;
    export const POSTCODE_SEARCH_FORM_INCLUDE_PREVIOUS_OCCUPANTS_ID: string;
    export const POSTCODE_SEARCH_CLEAR_BUTTON_ID: string;
    export const POSTCODE_SEARCH_HINT_ID: string;
    export const POSTCODE_SUBMIT_ID: string;
    export const NOT_FOUND_RETURN_LINK_ID: string;
}

// FormIdConstants
declare module "ncrs-host/FormIdConstants" {
    export const NHS_NUMBER_SEARCH_LABEL_ID: string;
    export const BASIC_SEARCH_LABEL_ID: string;
    export const ADVANCED_SEARCH_LABEL_ID: string;
    export const POSTCODE_SEARCH_LABEL_ID: string;
}

// AccessibilityHelpers
declare module "ncrs-host/AccessibilityHelpers" {
    export const OnEnterPressed: (callback: (e: any) => void) => (e: any) => void;
    export const SimulateClickEvent: (e: any) => void;
}

// FocusHelpers
declare module "ncrs-host/FocusHelpers" {
    export const asyncFocus: (id: string) => void;
    export const asyncInputFocus: (id: string) => void;
}

// DateHelper
declare module "ncrs-host/DateHelper" {
    export const isDateBlank: (date: any) => boolean;
    export const datePartsItemContainsNonNumberChars: (date: any) => boolean;
    export const getDateInputSwitcherInputIds: (formId: string, fieldType: string, method: any) => [string, string];
    export const getDateRange: (from?: any, to?: any) => { from: string; to: string };
}

// PostcodeSearchHelpers
declare module "ncrs-host/PostcodeSearchHelpers" {
    export const hasValidRole: (userPermissions: any) => boolean;
}

// CommonValidators
declare module "ncrs-host/CommonValidators" {
    export const validateState: (inputs: any) => boolean;
}

// NhsNumberValidator
declare module "ncrs-host/NhsNumberValidator" {
    const isValid: (nhsNumber: string) => boolean;
    export default isValid;
}

// AdvancedSearchValidator
declare module "ncrs-host/AdvancedSearchValidator" {
    export const validateStringInput: (field: string, value: string, algorithmicSearch?: boolean, firstnameBlank?: boolean, postcodeBlank?: boolean) => any;
    export const validateDateRange: (dateFrom: any, dateTo: any, fromLabel: string, toLabel: string) => { dateFrom: any; dateTo: any };
}

// PatientSearchValidationRules
declare module "ncrs-host/PatientSearchValidationRules" {
    export const validateMandatoryDate: (value: any, label: string) => any;
    export const validateSearchGender: (value: string) => any;
}

// PostcodeSearchValidators
declare module "ncrs-host/PostcodeSearchValidators" {
    export const validateStringInput: (field: string, value: string) => any;
    export const validateDateRange: (dateFrom: any, dateTo: any, options: any) => { dateFrom: any; dateTo: any };
    export const validateDOBDateRange: (dateFrom: any, dateTo: any, fromLabel: string, toLabel: string) => { dateFrom: any; dateTo: any };
}

// DateConstants
declare module "ncrs-host/DateConstants" {
    export type DateInputMethods = "singleDate" | "dateRange" | "ageRange";
    export const DateInputMethods: {
        SingleDate: "singleDate";
        DateRange: "dateRange";
        AgeRange: "ageRange";
    };
    export type DateInputSwitcherStringMap = Record<string, string>;
    export const SINGLE_DATE_INPUT_RESPONSES: Record<string, string>;
}

// SingleDateInputRegExps
declare module "ncrs-host/SingleDateInputRegExps" {
    export const REGEX_PARTIAL_DATE: RegExp;
}

// Vocabulary
declare module "ncrs-host/Vocabulary" {
    export const GENDER_SEARCH_VALUES: { female: string; male: string; search_all: string };
}

// GenericStrings
declare module "ncrs-host/GenericStrings" {
    export const CLEAR: string;
}

// CommonStrings
declare module "ncrs-host/CommonStrings" {
    export const SEARCH_BY: string;
    export const NOT_PROVIDED: string;
}

// FindPatientStringsCore
declare module "ncrs-host/FindPatientStringsCore" {
    export const PATIENT_SEARCH_OCCUPANCY_DATE_RANGE_FROM_LABEL: string;
    export const PATIENT_SEARCH_OCCUPANCY_DATE_RANGE_TO_LABEL: string;
}

// TabActionCreator
declare module "ncrs-host/TabActionCreator" {
    export const activateNHSNumberSearchTab: () => any;
    export const activateBasicSearchTab: () => any;
    export const activateAdvancedSearchTab: () => any;
    export const activatePostcodeSearchTab: () => any;
}

// ModalActionCreator
declare module "ncrs-host/ModalActionCreator" {
    export const createFindPatientConnectionWarningAction: () => any;
    export const createCloseModalAction: () => any;
}

// NhsNumberQueryActionCreator
declare module "ncrs-host/NhsNumberQueryActionCreator" {
    export const nhsNumberSearch: (nhsNumber: string) => any;
}

// BasicSearchQueryActionCreator
declare module "ncrs-host/BasicSearchQueryActionCreator" {
    export const runBasicQuery: (args: any) => any;
}

// AdvancedSearchQueryActionCreator
declare module "ncrs-host/AdvancedSearchQueryActionCreator" {
    export const runAdvancedQuery: (args: any) => any;
}

// PostcodeSearchQueryActionCreator
declare module "ncrs-host/PostcodeSearchQueryActionCreator" {
    export const runPostcodeQuery: (args: any) => any;
}

// SaveQueryActionCreator
declare module "ncrs-host/SaveQueryActionCreator" {
    export const updateFormState: (state: any) => any;
    export const resetFormState: () => any;
}

// Store
declare module "ncrs-host/store" {
    export const useAppDispatch: () => any;
    export const useAppSelector: <T>(selector: (state: any) => T) => T;
}

// SampleEmptyStates
declare module "ncrs-host/SampleEmptyStates" {
    export const getEmptyDateParts: () => any;
}

// FormErrorSummary
declare module "ncrs-host/FormErrorSummary" {
    export type FormErrorSummaryError = { error: string; element: string; focus?: boolean };
    const FormErrorSummary: React.FC<{ errors: FormErrorSummaryError[] }>;
    export default FormErrorSummary;
}

// SingleDateInput
declare module "ncrs-host/SingleDateInput" {
    const SingleDateInput: React.FC<any>;
    export default SingleDateInput;
}

// DateInputSwitcher
declare module "ncrs-host/DateInputSwitcher" {
    const DateInputSwitcher: React.FC<any>;
    export default DateInputSwitcher;
}

// DateRangeInput
declare module "ncrs-host/DateRangeInput" {
    const DateRangeInput: React.FC<any>;
    export default DateRangeInput;
}

// OSPlacesAddressFinder
declare module "ncrs-host/OSPlacesAddressFinder" {
    const OSPlacesAddressFinder: React.FC<any>;
    export default OSPlacesAddressFinder;
}

// DateFormatter
declare module "ncrs-host/DateFormatter" {
    export const datePartsToSpineDate: (date: any) => string;
    export const getDatePartsAsSingleInputString: (date: any) => string;
    export const getBlankDate: () => any;
}

// PostCodeFormatter
declare module "ncrs-host/PostCodeFormatter" {
    export const formatPostcode: (postcode: string) => string;
}
