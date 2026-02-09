import {
    PostcodeSearchArguments,
    QueryArguments,
} from "ncrs-host/AppStateTypes";
import {
    PSR_SEARCH_TIP_ADJUST_NUMBER_OF_RESULTS,
    PSR_SEARCH_TIP_BASIC,
    PSR_SEARCH_TIP_LAST_NAME_ONLY,
    PSR_SEARCH_TIP_LAST_NAME_WILDCARD,
    PSR_SEARCH_TIP_POSTCODE_WILDCARD,
    PSR_SEARCH_TIP_PREVIOUS_OCCUPANTS,
    PSR_SEARCH_TIP_REDUCE_DOB__OR_AGE_RANGE,
    PSR_SEARCH_TIP_RETRY,
    PSR_SEARCH_TIP_SINGLE_DOB__OR_GENDER,
    PSR_SEARCH_TIP_SUGGEST_ADVANCED_SEARCH,
} from "ncrs-host/PatientSearchResultsStrings";

type SearchArguments = QueryArguments | PostcodeSearchArguments;

const isAdvanced = (type: string) => type === "advanced";
const isPostcode = (type: string) => type === "postcode";
const isBasic = (type: string) => type === "basic";

const isTooManyResults = (count: number): boolean => {
    return count == -1;
};

const isNoResults = (count: number) => count === 0;

const hasDobRange = (args: SearchArguments) =>
    "dobFrom" in args &&
    !!args.dobFrom &&
    "dobTo" in args &&
    !!args.dobTo &&
    args.dobTo !== args.dobFrom;

const hasSingleDob = (args: SearchArguments) =>
    "dobFrom" in args &&
    !!args.dobFrom &&
    "dobTo" in args &&
    !!args.dobTo &&
    args.dobFrom === args.dobTo;

const hasFirstName = (args: SearchArguments) => !!args.firstname?.trim();

const hasSpecifiedGender = (args: SearchArguments) =>
    "gender" in args && !!args.gender && args.gender !== "X";

const hasPostcode = (args: SearchArguments) =>
    "postcode" in args && !!args.postcode?.trim();

const isIgnoringHistory = (args: SearchArguments) =>
    "ignoreHistoryIndicator" in args && args.ignoreHistoryIndicator === "1";

export const formatSearchTips = (
    searchType: string,
    resultsCount: number,
    queryArgs: SearchArguments
): string[] => {
    const tips: string[] = [];

    const shouldShowBasicTips =
        isBasic(searchType) && !isTooManyResults(resultsCount);
    const shouldShowLastNameWildcardTip =
        ["basic", "advanced", "postcode"].includes(searchType) &&
        !isTooManyResults(resultsCount);
    const shouldShowLastNameOnlyTip =
        ["advanced", "postcode"].includes(searchType) &&
        !isTooManyResults(resultsCount) &&
        hasFirstName(queryArgs);
    const shouldShowSingleDobOrGenderTip =
        isAdvanced(searchType) &&
        !isTooManyResults(resultsCount) &&
        (hasSingleDob(queryArgs) || hasSpecifiedGender(queryArgs));
    const shouldShowReduceDobOrAgeRangeTip =
        ["advanced", "postcode"].includes(searchType) &&
        isTooManyResults(resultsCount) &&
        hasDobRange(queryArgs);
    const shouldShowPostcodeWildcard =
        isAdvanced(searchType) &&
        !isTooManyResults(resultsCount) &&
        hasPostcode(queryArgs);
    const shouldShowPreviousOccupantsTip =
        isPostcode(searchType) &&
        !isTooManyResults(resultsCount) &&
        isIgnoringHistory(queryArgs);
    const shouldShowRetryTip = isPostcode(searchType);
    const shouldSuggestAdvancedSearch =
        isPostcode(searchType) && isNoResults(resultsCount);

    if (shouldShowBasicTips) {
        tips.push(PSR_SEARCH_TIP_BASIC);
    }

    if (shouldShowLastNameWildcardTip) {
        tips.push(PSR_SEARCH_TIP_LAST_NAME_WILDCARD);
    }

    if (shouldShowLastNameOnlyTip) {
        tips.push(PSR_SEARCH_TIP_LAST_NAME_ONLY);
    }

    if (shouldShowSingleDobOrGenderTip) {
        tips.push(PSR_SEARCH_TIP_SINGLE_DOB__OR_GENDER);
    }

    if (shouldShowReduceDobOrAgeRangeTip) {
        tips.push(PSR_SEARCH_TIP_REDUCE_DOB__OR_AGE_RANGE);
    }

    if (shouldShowPostcodeWildcard) {
        tips.push(PSR_SEARCH_TIP_POSTCODE_WILDCARD);
    }

    if (shouldShowPreviousOccupantsTip) {
        tips.push(PSR_SEARCH_TIP_PREVIOUS_OCCUPANTS);
    }

    if (shouldShowRetryTip) {
        tips.push(PSR_SEARCH_TIP_RETRY);
    }

    if (shouldSuggestAdvancedSearch) {
        tips.push(PSR_SEARCH_TIP_SUGGEST_ADVANCED_SEARCH);
    }

    tips.push(PSR_SEARCH_TIP_ADJUST_NUMBER_OF_RESULTS);

    return tips;
};
