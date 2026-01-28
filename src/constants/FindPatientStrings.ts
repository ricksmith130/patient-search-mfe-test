// Find Patient
export const FIND_PATIENT_PAGE_HEADER = "Find patient";
export const FIND_PATIENT_NHS_NUMBER = "NHS Number";
export const FIND_PATIENT_NHS_NUMBER_LABEL = "Find a patient using NHS number";
export const FIND_PATIENT_BASIC_DETAILS = "Basic";
export const FIND_PATIENT_BASIC_DETAILS_LABEL =
    "Find a patient using basic details";
export const FIND_PATIENT_ADVANCED_DETAILS = "Advanced";
export const FIND_PATIENT_ADVANCED_DETAILS_LABEL =
    "Find a patient using advanced details";
export const FIND_PATIENT_POSTCODE = "Postcode";
export const FIND_PATIENT_POSTCODE_LABEL = "Find a patient using postcode";

// By NHS Number
export const NHS_NUM_SEARCH_LABEL = "NHS Number";

// By Postcode
export const POSTCODE_SEARCH_HEADER = "Search by Postcode";
export const POSTCODE_SEARCH_HINT = "Enter as many details as you know";
export const POSTCODE_FIND_A_PATIENT = "Find a patient";
export const POSTCODE_SEARCH_POSTCODE_LABEL = "Full postcode";
export const POSTCODE_SEARCH_EFFECTIVE_RANGE_LABEL = "Occupancy date range";
export const POSTCODE_SEARCH_INCLUDE_PREVIOUS_OCCUPANTS =
    "Include previous occupants in search results";

export const NHS_NUM_SEARCH_INVALID = "This is not a valid NHS Number";
export const NHS_NUM_SEARCH_TOO_SHORT = "NHS Number must be 10 digits long";
export const NHS_NUM_SEARCH_EXAMPLE = "For example: 943 476 5919";
export const NHS_NUM_SEARCH_FIND_A_PATIENT = "Find a patient";

// PATIENT details

export const PATIENT_SEARCH_GENDER_LABEL = "Gender";
export const PATIENT_SEARCH_GENDER_MALE_LABEL = "Male";
export const PATIENT_SEARCH_GENDER_FEMALE_LABEL = "Female";
export const PATIENT_SEARCH_GENDER_SEARCH_ALL_LABEL = "Search all";
export const PATIENT_SEARCH_GENDER_SEARCH_ALL_CONDITIONAL_TEXT =
    "You have chosen to search for all genders. Please note that selecting this option will increase your search time";

export const PATIENT_SEARCH_FIRST_NAME_LABEL = "First Name";
export const PATIENT_SEARCH_SURNAME_LABEL = "Last Name";
export const PATIENT_SEARCH_WIDEN_LABEL =
    "Widen search to include similar names and misspellings";

export const PATIENT_SEARCH_OCCUPANCY_DATE_RANGE_FROM_LABEL = "Year from";
export const PATIENT_SEARCH_OCCUPANCY_DATE_RANGE_TO_LABEL = "Year to";
export const PATIENT_SEARCH_DATE_RANGE_FROM_LABEL = "Date from";
export const PATIENT_SEARCH_DATE_RANGE_TO_LABEL = "Date to";
export const PATIENT_SEARCH_DOB_LABEL = "Date of birth";
export const PATIENT_SEARCH_DOB_RANGE_LABEL =
    PATIENT_SEARCH_DOB_LABEL + " range";
export const PATIENT_SEARCH_DOD_LABEL = "Date of death";
export const PATIENT_SEARCH_DOD_RANGE_LABEL =
    PATIENT_SEARCH_DOD_LABEL + " range";
export const PATIENT_SEARCH_DATE_FROM = " from";
export const PATIENT_SEARCH_DATE_TO = " to";
export const PATIENT_SEARCH_DATE_EXAMPLE = "For example, 31 3 1980";
export const PATIENT_SEARCH_INCLUDE_DOD_LABEL =
    "Only search for people who have died";

export const PATIENT_SEARCH_AGE_RANGE_LABEL = "Age range";
export const PATIENT_SEARCH_AGE_RANGE_FROM_LABEL = "Age from";
export const PATIENT_SEARCH_AGE_RANGE_TO_LABEL = "Age to";

export const PATIENT_SEARCH_POSTCODE_LABEL = "Postcode";

export const ADVANCED_SEARCH_HEADER = "Search by Advanced Details";
export const BASIC_SEARCH_HEADER = "Search by Basic Details";

export const ADVANCED_SEARCH_HINT = "Enter as many details as you know";
export const BASIC_SEARCH_HINT = "Enter all fields";

export const BASIC_SEARCH_FIND_A_PATIENT = "Find a patient";
export const ADVANCED_SEARCH_FIND_A_PATIENT = "Find a patient";

// search validation
export const PATIENT_SEARCH_VALIDATION_REQUIRED = "Enter a {{{FieldName}}}";
export const PATIENT_SEARCH_VALIDATION_REQUIRED_VOWEL =
    "Enter an {{{FieldName}}}";
export const PATIENT_SEARCH_VALIDATION_REQUIRED_FOR_GENDER = " Select a gender";
export const PATIENT_SEARCH_VALIDATION_REQUIRED_FOR_LAST_NAME =
    " Enter a last name";
export const PATIENT_SEARCH_VALIDATION_REQUIRED_FOR_WIDEN =
    "Enter at least one from First Name or Postcode when 'Widen search' option is selected";
export const PATIENT_SEARCH_VALIDATION_NO_WILDCARDS =
    "Wildcard character (*) is not allowed for this type of search";
export const PATIENT_SEARCH_VALIDATION_NO_START_WILDCARD =
    "Wildcard character (*) must not be the first or second character in {{{FieldName}}}";
export const PATIENT_SEARCH_VALIDATION_DATE_TOO_OLD =
    "{{{FieldName}}} must be less than 150 years in the past";
export const PATIENT_SEARCH_VALIDATION_EFFECTIVE_DATE_TOO_OLD =
    "{{{FieldName}}} must be less than 150 years in the future";
export const PATIENT_SEARCH_VALIDATION_DOB_IN_FUTURE =
    "{{{FieldName}}} must be today or in the past";
export const PATIENT_SEARCH_VALIDATION_DOB_INVALID =
    "{{{FieldName}}} must be a real date";
export const INVALID_DATE_RANGE = "The 'to' date must be after the 'from' date";
export const INVALID_EFFECTIVE_DATE_RANGE =
    "Effective to must be the same as or after Effective from";
