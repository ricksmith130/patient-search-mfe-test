// Patient search results
export const PSR_QUERY_HELP_ALLOCATE = "Alternatively, you can ";

export const PSR_RESULT_COUNT_MULTIPLE =
    "Showing {{{rangeStart}}}-{{{rangeEnd}}} of {{{resultsCount}}} results for the search:";
export const PSR_RESULT_COUNT_SINGLE = "Showing 1 of 1 result for the search:";
export const PSR_RESULT_COUNT_NONE = "No results found for the following:";
export const PSR_RESULT_COUNT_OVER_MAX = "Too many results found";

export const PSR_FILTER_SEARCH_LABEL = "Search within results";
export const RESULTS_FILTER_GENDER_LABEL = "Filter by gender";
export const RESULTS_FILTER_GENDER_ALL_LABEL = "All";
export const RESULTS_FILTER_GENDER_MALE_LABEL = "Male";
export const RESULTS_FILTER_GENDER_FEMALE_LABEL = "Female";
export const HIDE_DECEASED_PATIENTS_LABEL = "Hide deceased patients";
export const LAST_NAME_FIRST_LABEL = "Switch first and last names";
export const PRS_FILTER_COUNT =
    "Showing {{{filteredNumber}}} of {{totalResults}} results";

export const GENDER_FILTER_VALUES = {
    male: "Male",
    female: "Female",
    all: "X",
};

export const PSR_RESULT_QUERY_GENDER = "Gender: ";
export const PSR_RESULT_QUERY_FIRSTNAME = "First name: ";
export const PSR_RESULT_QUERY_SURNAME = "Last name: ";
export const PSR_RESULT_QUERY_DOB = "Date of birth: ";
export const PSR_RESULT_QUERY_DOB_RANGE =
    "Between {{{dobFrom}}} and {{{dobTo}}}";
export const PSR_RESULT_QUERY_DOD = "Date of death: ";
export const PSR_RESULT_QUERY_DOD_RANGE =
    "Between {{{dodFrom}}} and {{{dodTo}}}";
export const PSR_RESULT_QUERY_POSTCODE = "Postcode: ";
export const PSR_RESULT_QUERY_WIDEN = "Widen search: ";
export const PSR_RESULT_QUERY_OCCUPANCY = "Occupancy: ";
export const PSR_RESULT_QUERY_CURRENT_OCCUPANTS_ONLY = "Current occupants only";
export const PSR_RESULT_QUERY_INCLUDE_PREVIOUS_OCCUPANTS =
    "Current and previous occupants between {{{addressEffectiveFrom}}} and {{{addressEffectiveTo}}}";

export const PSR_RESULT_ROW_DQ_ISSUE = "Warning: may be incorrect";
export const PSR_RESULT_ROW_DECEASED = "(DECEASED)";
export const PSR_RESULT_ROW_DATE_OF_DEATH = "Date of Death: ";

export const PSR_ALLOCATE_NHS_NUMBER = "allocate a new NHS Number";
export const PSR_REFINE_START_AGAIN = " or ";
export const PSR_CREATE_BIRTH_NOTIFICATION =
    "create a birth notification without the mother's NHS details";

export const PSR_SEARCH_TIPS_HEADER = "Tips for searching:";
export const PSR_SEARCH_TIP_BASIC =
    "An Advanced search will allow you to include an age or date of birth range. You can also widen your search to include similar names and misspellings.";
export const PSR_SEARCH_TIP_LAST_NAME_WILDCARD =
    "You can use the star symbol (*) instead of letters if you do not know how to spell the last name, but you must enter at least the first 2 letters. For example, Edm* could match Edmonds or Edmunds.";
export const PSR_SEARCH_TIP_LAST_NAME_ONLY =
    "First name is optional, so you can try searching again using just a last name.";
export const PSR_SEARCH_TIP_SINGLE_DOB__OR_GENDER =
    "You can also search again with an age or date of birth range, or try searching all genders.";
export const PSR_SEARCH_TIP_REDUCE_DOB__OR_AGE_RANGE =
    "Reducing the date of birth or age range can narrow the search results.";
export const PSR_SEARCH_TIP_POSTCODE_WILDCARD =
    "You can use the star symbol (*) instead of characters if you do not know the full postcode. You must enter at least the first 2 letters. For example, LS61* could match LS6 1JL.";
export const PSR_SEARCH_TIP_PREVIOUS_OCCUPANTS =
    "You can edit your search to include previous occupants with an occupancy date range.";
export const PSR_SEARCH_TIP_RETRY =
    "You can also try searching again with a first name or last name, or a date of birth range.";
export const PSR_SEARCH_TIP_SUGGEST_ADVANCED_SEARCH =
    "If you know the patient's name and age range, you can try an Advanced search instead. This will allow you to use the star symbol (*) instead of characters if you do not know the full postcode. You must enter at least the first 2 letters. For example, LS61* could match LS6 1JL.";
export const PSR_SEARCH_TIP_ADJUST_NUMBER_OF_RESULTS =
    'To adjust the number of search results per page, use the "Number of search results" setting in the settings modal. Options include 15, 25, 50, 100, 200, or 500 results per page. This helps you control how many results you see at once.';
export const PSR_SEARCH_GUIDANCE =
    "View detailed search tips (opens in new tab)";
export const PSR_TOO_MANY_RESULTS_LINK =
    "https://digital.nhs.uk/services/national-care-records-service/guidance/find-patient?utm_source=NCRS&utm_medium=link&utm_campaign=too-many-results-page";

export const PATIENT_SEARCH_COUNT_ALL = 99999;
export const DEFAULT_SEARCH_RESULTS_COUNT = 50;

export const PATIENT_SEARCH_ROW_COUNT_OPTIONS = [
    15,
    25,
    DEFAULT_SEARCH_RESULTS_COUNT,
    100,
    200,
    PATIENT_SEARCH_COUNT_ALL,
]; // Basic/Advanced max is 50. Postcode is 500. 99999 is there as a numeric version of "Show all"

export const DOCUMENT_SEARCH_ROW_COUNT_OPTIONS = [
    25,
    DEFAULT_SEARCH_RESULTS_COUNT,
    100,
    200,
    PATIENT_SEARCH_COUNT_ALL,
];

export const PATIENT_SEARCH_ROW_COUNT_ALL = "Show all";
