import Mustache from "mustache";
import React from "react";

import { DateInputMethods } from "ncrs-host/DateConstants";
import { REFINE_LINK_ID } from "ncrs-host/IdConstants";
import {
    ADVANCED,
    BASIC,
    POSTCODE,
} from "ncrs-host/QueryTypes";
import {
    DateParts,
    DateRange,
    PostcodeSearchArguments,
    QueryArguments,
    SearchFormDateInputMethods,
    SearchFormUpdate,
} from "ncrs-host/AppStateTypes";
import { OnEnterPressed } from "ncrs-host/AccessibilityHelpers";
import { splitSpineDate } from "ncrs-host/DateFormatter";
import {
    navigateToAdvancedSearchAction,
    navigateToBasicSearchAction,
    navigateToPostcodeSearchAction,
} from "ncrs-host/NavigationActions";
import { updateFormState } from "ncrs-host/SaveQueryActionCreator";
import { useAppDispatch, useAppSelector } from "ncrs-host/store";

const queryToFormUpdate: (
    q: QueryArguments,
    d: SearchFormDateInputMethods
) => SearchFormUpdate = (
    query: QueryArguments,
    dateInputModes: SearchFormDateInputMethods
) => {
    const dobRange = getDateRange(
        dateInputModes.dob,
        query.dobFrom,
        query.dobTo
    );
    const dodRange = getDateRange(
        dateInputModes.dod,
        query.dateOfDeathFrom,
        query.dateOfDeathTo
    );
    return {
        gender: query.gender,
        surname: query.surname,
        algorithmicSearch: query.algorithmicSearch ?? false,
        firstname: query.firstname ?? "",
        postcode: query.postcode ?? "",
        dobFrom: dobRange.from,
        dobTo: dobRange.to,
        dodFrom: dodRange.from,
        dodTo: dodRange.to,
    };
};

const postcodeQueryToFormUpdate: (
    q: PostcodeSearchArguments,
    d: SearchFormDateInputMethods
) => SearchFormUpdate = (
    query: PostcodeSearchArguments,
    dateInputModes: SearchFormDateInputMethods
) => {
    const dobRange = getDateRange(
        dateInputModes.dob,
        query.dobFrom,
        query.dobTo
    );
    return {
        postcode: query.postcode,
        addressEffectiveFrom: splitSpineDate(query.addressEffectiveFrom),
        addressEffectiveTo: splitSpineDate(query.addressEffectiveTo),
        firstname: query.firstname ?? "",
        surname: query.surname ?? "",
        dobFrom: dobRange.from,
        dobTo: dobRange.to,
        ignoreHistoryIndicator: query?.ignoreHistoryIndicator ?? "1",
    };
};

const getDateRange = (
    dateMode: DateInputMethods,
    from?: string,
    to?: string
): DateRange<DateParts<string>> => {
    const partsFrom = splitSpineDate(from);
    const partsTo = splitSpineDate(to);
    // If the date range is an exact multiple of a year, convert to year only.
    // This is so that the date fields have the right initial values.
    if (
        partsFrom.day == "01" &&
        partsFrom.month == "01" &&
        partsTo.day == "31" &&
        partsTo.month == "12"
    ) {
        partsFrom.day = "";
        partsFrom.month = "";
        partsTo.day = "";
        partsTo.month = "";
        if (dateMode == DateInputMethods.SingleDate) {
            partsTo.year = "";
        }
    }
    return {
        from: partsFrom,
        to: partsTo,
    };
};

const QueryRefineOptions: React.FC = () => {
    const dispatch = useAppDispatch();
    const searchType = useAppSelector((state: any) => state.query.queryType);
    const previousPostcodeQuery = useAppSelector(
        (state: any) => state.query.postcodeSearchArguments
    );
    const previousQuery = useAppSelector((state: any) => state.query.queryArguments);
    const dateInputModes = useAppSelector(
        (state: any) => state.findPatient.dateInputMethods
    );

    const navigateToBasicSearch = () => {
        dispatch(navigateToBasicSearchAction());
    };
    const navigateToAdvancedSearch = () => {
        dispatch(navigateToAdvancedSearchAction());
    };
    const navigateToPostcodeSearch = () => {
        dispatch(navigateToPostcodeSearchAction());
    };
    const dispatchUpdateFormState = (u: SearchFormUpdate) => {
        dispatch(updateFormState(u));
    };

    const editSearchText = Mustache.render("Edit {{{searchType}}} search", {
        searchType: searchType,
    });
    return (
        <div className="button__group">
            <a
                className="nhsuk-button print-button nhsuk-u-margin-0"
                id={REFINE_LINK_ID}
                tabIndex={0}
                role="button"
                onClick={(event) => {
                    event.preventDefault();
                    if (searchType == POSTCODE) {
                        if (previousPostcodeQuery) {
                            dispatchUpdateFormState(
                                postcodeQueryToFormUpdate(
                                    previousPostcodeQuery,
                                    dateInputModes
                                )
                            );
                        }
                        navigateToPostcodeSearch();
                    } else {
                        if (previousQuery) {
                            dispatchUpdateFormState(
                                queryToFormUpdate(previousQuery, dateInputModes)
                            );
                        }
                        if (searchType == BASIC) {
                            navigateToBasicSearch();
                        } else {
                            navigateToAdvancedSearch();
                        }
                    }
                }}
                onKeyDown={OnEnterPressed((event: any) => {
                    event.preventDefault();
                    if (searchType == POSTCODE) {
                        if (previousPostcodeQuery) {
                            dispatchUpdateFormState(
                                postcodeQueryToFormUpdate(
                                    previousPostcodeQuery,
                                    dateInputModes
                                )
                            );
                        }
                        navigateToPostcodeSearch();
                    } else {
                        if (previousQuery) {
                            dispatchUpdateFormState(
                                queryToFormUpdate(previousQuery, dateInputModes)
                            );
                        }
                        if (searchType == BASIC) {
                            navigateToBasicSearch();
                        } else {
                            navigateToAdvancedSearch();
                        }
                    }
                })}
            >
                {editSearchText}
            </a>
            {searchType != ADVANCED && (
                <a
                    className="nhsuk-u-margin-left-3"
                    id={REFINE_LINK_ID}
                    tabIndex={0}
                    role="button"
                    onClick={(event) => {
                        event.preventDefault();
                        if (searchType == POSTCODE) {
                            if (previousPostcodeQuery) {
                                dispatchUpdateFormState(
                                    postcodeQueryToFormUpdate(
                                        previousPostcodeQuery,
                                        dateInputModes
                                    )
                                );
                            }
                            navigateToAdvancedSearch();
                        } else {
                            if (previousQuery) {
                                dispatchUpdateFormState(
                                    queryToFormUpdate(
                                        previousQuery,
                                        dateInputModes
                                    )
                                );
                            }
                            navigateToAdvancedSearch();
                        }
                    }}
                    onKeyDown={OnEnterPressed((event: any) => {
                        event.preventDefault();
                        if (searchType == POSTCODE) {
                            if (previousPostcodeQuery) {
                                dispatchUpdateFormState(
                                    postcodeQueryToFormUpdate(
                                        previousPostcodeQuery,
                                        dateInputModes
                                    )
                                );
                            }
                            navigateToAdvancedSearch();
                        } else {
                            if (previousQuery) {
                                dispatchUpdateFormState(
                                    queryToFormUpdate(
                                        previousQuery,
                                        dateInputModes
                                    )
                                );
                            }
                            navigateToAdvancedSearch();
                        }
                    })}
                >
                    or use Advanced search
                </a>
            )}
        </div>
    );
};

export default QueryRefineOptions;
