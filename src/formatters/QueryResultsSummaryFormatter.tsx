import Mustache from "mustache";
import React from "react";

import { isEmpty } from "ncrs-host/GenericHelpers";
import { spineDateToDisplayDate } from "ncrs-host/DateFormatter";
import { formatGender } from "ncrs-host/GenderFormatter";
import {
    PostcodeSearchArguments,
    QueryArguments,
} from "ncrs-host/AppStateTypes";
import {
    PSR_RESULT_QUERY_CURRENT_OCCUPANTS_ONLY,
    PSR_RESULT_QUERY_DOB,
    PSR_RESULT_QUERY_DOB_RANGE,
    PSR_RESULT_QUERY_DOD,
    PSR_RESULT_QUERY_DOD_RANGE,
    PSR_RESULT_QUERY_FIRSTNAME,
    PSR_RESULT_QUERY_GENDER,
    PSR_RESULT_QUERY_INCLUDE_PREVIOUS_OCCUPANTS,
    PSR_RESULT_QUERY_OCCUPANCY,
    PSR_RESULT_QUERY_POSTCODE,
    PSR_RESULT_QUERY_SURNAME,
    PSR_RESULT_QUERY_WIDEN,
} from "ncrs-host/PatientSearchResultsStrings";

const addSummaryRow = (
    key: string,
    value: string | React.ReactNode,
    rowKey: string,
    summaryItems: React.ReactNode[]
) => {
    summaryItems.push(
        <div
            className="nhsuk-summary-list__row"
            key={rowKey}
        >
            <dt className="nhsuk-summary-list__key">{key}</dt>
            <dd className="nhsuk-summary-list__value">
                <span className="data-field__content">{value}</span>
            </dd>
        </div>
    );
};

export const formatResultsSummary = (queryArguments: QueryArguments) => {
    const summaryItems: React.ReactNode[] = [];

    addSummaryRow(
        PSR_RESULT_QUERY_GENDER,
        formatGender(queryArguments.gender),
        "gender",
        summaryItems
    );

    if (queryArguments.firstname) {
        addSummaryRow(
            PSR_RESULT_QUERY_FIRSTNAME,
            queryArguments.firstname,
            "firstname",
            summaryItems
        );
    }

    addSummaryRow(
        PSR_RESULT_QUERY_SURNAME,
        queryArguments.surname,
        "surname",
        summaryItems
    );

    if (queryArguments.algorithmicSearch) {
        addSummaryRow(PSR_RESULT_QUERY_WIDEN, "On", "widen", summaryItems);
    }

    if (
        !queryArguments.dobTo ||
        queryArguments.dobTo === queryArguments.dobFrom
    ) {
        addSummaryRow(
            PSR_RESULT_QUERY_DOB,
            spineDateToDisplayDate(queryArguments.dobFrom),
            "dob",
            summaryItems
        );
    } else {
        const dobText = Mustache.render(PSR_RESULT_QUERY_DOB_RANGE, {
            dobFrom: spineDateToDisplayDate(queryArguments.dobFrom),
            dobTo: spineDateToDisplayDate(queryArguments.dobTo),
        });
        addSummaryRow(PSR_RESULT_QUERY_DOB, dobText, "dob-range", summaryItems);
    }

    if (queryArguments.postcode) {
        addSummaryRow(
            PSR_RESULT_QUERY_POSTCODE,
            queryArguments.postcode.toUpperCase(),
            "postcode",
            summaryItems
        );
    }

    if (!isEmpty(queryArguments.dateOfDeathTo)) {
        if (queryArguments.dateOfDeathTo === queryArguments.dateOfDeathFrom) {
            addSummaryRow(
                PSR_RESULT_QUERY_DOD,
                spineDateToDisplayDate(queryArguments.dateOfDeathFrom),
                "dod",
                summaryItems
            );
        } else {
            const dodText = Mustache.render(PSR_RESULT_QUERY_DOD_RANGE, {
                dodFrom: spineDateToDisplayDate(queryArguments.dateOfDeathFrom),
                dodTo: spineDateToDisplayDate(queryArguments.dateOfDeathTo),
            });
            addSummaryRow(
                PSR_RESULT_QUERY_DOD,
                dodText,
                "dod-range",
                summaryItems
            );
        }
    }

    return <>{summaryItems}</>;
};

export const formatPostcodeSearchResultsSummary = (
    postcodeSearchArguments: PostcodeSearchArguments
) => {
    const summaryItems: React.ReactNode[] = [];

    if (postcodeSearchArguments.postcode) {
        addSummaryRow(
            PSR_RESULT_QUERY_POSTCODE,
            postcodeSearchArguments.postcode.toUpperCase(),
            "postcode",
            summaryItems
        );
    }

    if (postcodeSearchArguments.ignoreHistoryIndicator === "1") {
        addSummaryRow(
            PSR_RESULT_QUERY_OCCUPANCY,
            PSR_RESULT_QUERY_CURRENT_OCCUPANTS_ONLY,
            "occupancy",
            summaryItems
        );
    } else {
        const occupancyText = Mustache.render(
            PSR_RESULT_QUERY_INCLUDE_PREVIOUS_OCCUPANTS,
            {
                addressEffectiveFrom: spineDateToDisplayDate(
                    postcodeSearchArguments.addressEffectiveFrom
                ),
                addressEffectiveTo: spineDateToDisplayDate(
                    postcodeSearchArguments.addressEffectiveTo
                ),
            }
        );
        addSummaryRow(
            PSR_RESULT_QUERY_OCCUPANCY,
            occupancyText,
            "occupancy",
            summaryItems
        );
    }

    if (postcodeSearchArguments.firstname) {
        addSummaryRow(
            PSR_RESULT_QUERY_FIRSTNAME,
            postcodeSearchArguments.firstname,
            "firstname",
            summaryItems
        );
    }

    if (postcodeSearchArguments.surname) {
        addSummaryRow(
            PSR_RESULT_QUERY_SURNAME,
            postcodeSearchArguments.surname,
            "surname",
            summaryItems
        );
    }

    if (
        !postcodeSearchArguments.dobTo ||
        postcodeSearchArguments.dobTo === postcodeSearchArguments.dobFrom
    ) {
        addSummaryRow(
            PSR_RESULT_QUERY_DOB,
            spineDateToDisplayDate(postcodeSearchArguments.dobFrom),
            "dob",
            summaryItems
        );
    } else {
        const dobText = Mustache.render(PSR_RESULT_QUERY_DOB_RANGE, {
            dobFrom: spineDateToDisplayDate(postcodeSearchArguments.dobFrom),
            dobTo: spineDateToDisplayDate(postcodeSearchArguments.dobTo),
        });
        addSummaryRow(PSR_RESULT_QUERY_DOB, dobText, "dob-range", summaryItems);
    }

    return <>{summaryItems}</>;
};
