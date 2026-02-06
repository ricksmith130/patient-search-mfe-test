import React, { useEffect } from "react";

// @ts-ignore - Federated module
import { QUERY_SUMMARY_ID } from "ncrs-host/IdConstants";
// @ts-ignore - Federated module
import { viewSearchResults } from "ncrs-host/LogTransactions";
import {
    PSR_SEARCH_GUIDANCE,
    PSR_SEARCH_TIPS_HEADER,
    PSR_TOO_MANY_RESULTS_LINK,
} from "../../constants/PatientSearchResultsStrings";
// @ts-ignore - Federated module
import AllocateNHSNumberLinks from "ncrs-host/AllocateNHSNumberLinks";
// @ts-ignore - Federated module
import QueryRefineOptions from "ncrs-host/QueryRefineOptions";
// @ts-ignore - Federated module
import Sentinel from "ncrs-host/Sentinel";
// @ts-ignore - Federated module
import {
    formatPostcodeSearchResultsSummary,
    formatResultsSummary,
} from "ncrs-host/QueryResultsSummaryFormatter";
// @ts-ignore - Federated module
import { formatSearchTips } from "ncrs-host/SearchTipsFormatter";
import QueryResultsTable from "./QueryResultsTable";
// @ts-ignore - Federated module
import { logTransaction } from "ncrs-host/LogActionCreator";
// @ts-ignore - Federated module
import { nhsNumberSearch } from "ncrs-host/NhsNumberQueryActionCreator";
import { changeTableOptions } from "../../redux/slices/queryResultsSlice";
// @ts-ignore - Federated module
import { useAppDispatch, useAppSelector } from "ncrs-host/store";
// @ts-ignore - Federated module
import {
    PatientSearchResultsTableOptionsUpdate,
    PostcodeSearchArguments,
    QueryArguments,
} from "ncrs-host/AppStateTypes";

export const QueryResultsSummary: React.FC<{
    queryArguments: QueryArguments;
    postcodeSearchArguments?: PostcodeSearchArguments;
}> = (props) => {
    const { queryArguments, postcodeSearchArguments } = props;

    useEffect(() => {
        logTransaction(viewSearchResults)();
    }, []);
    return (
        <div>
            <div id={QUERY_SUMMARY_ID}>
                <div className="query-results-summary nhsuk-u-padding-top-3">
                    <div className="search-inputs nhsuk-u-reading-width">
                        <dl className="nhsuk-summary-list nhsuk-u-margin-bottom-3">
                            {queryArguments.surname !== "" ?
                                formatResultsSummary(queryArguments)
                            : (
                                postcodeSearchArguments !== undefined &&
                                postcodeSearchArguments?.postcode !== ""
                            ) ?
                                formatPostcodeSearchResultsSummary(
                                    postcodeSearchArguments
                                )
                            :   ""}
                        </dl>
                    </div>
                    <div className="query-results-refine">
                        <QueryRefineOptions />
                    </div>
                    <div className="query-results-refine">
                        <AllocateNHSNumberLinks />
                    </div>
                </div>
            </div>
        </div>
    );
};

const QueryResultsSearchTips: React.FC<{
    searchType: string;
    queryArguments: QueryArguments;
    postcodeSearchArguments?: PostcodeSearchArguments;
    resultsCount: number;
}> = (props) => {
    const {
        searchType,
        queryArguments,
        postcodeSearchArguments,
        resultsCount,
    } = props;

    const searchTips = formatSearchTips(
        searchType,
        resultsCount,
        searchType === "postcode" && postcodeSearchArguments ?
            postcodeSearchArguments
        :   queryArguments
    );

    return (
        <div className="col-xl-9 col-lg-12 col-md-12">
            <details
                className="nhsuk-details"
                open={resultsCount === 0 || resultsCount === -1}
            >
                <summary className="nhsuk-details__summary">
                    <span className="nhsuk-details__summary-text">
                        Show tips for searching
                    </span>
                </summary>
                <div className="nhsuk-form">
                    <div className="nhsuk-card data-panel search-tips">
                        <div className="nhsuk-card__content">
                            <h2 className="nhsuk-heading-s nhsuk-card__heading">
                                {PSR_SEARCH_TIPS_HEADER}
                            </h2>
                            <ul className="nhsuk-list nhsuk-list--bullet">
                                <>
                                    {searchTips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </>
                            </ul>
                            <p className="nhsuk-body-m">
                                <a
                                    href={PSR_TOO_MANY_RESULTS_LINK}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {PSR_SEARCH_GUIDANCE}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </details>
        </div>
    );
};

export const QueryResultsContent: React.FC<{
    sentinel: React.ReactElement<typeof Sentinel>;
}> = (props) => {
    const dispatch = useAppDispatch();
    const searchType = useAppSelector((state) => state.query.queryType);
    const queryResults = useAppSelector((state) => state.query.queryResults);
    const queryArguments = useAppSelector(
        (state) => state.query.queryArguments
    );
    const postcodeSearchArguments = useAppSelector(
        (state) => state.query.postcodeSearchArguments
    );
    const resultCount = useAppSelector(
        (state) => state.query.queryResults.resultsCount
    );
    const paginationPreference = useAppSelector(
        (state) => state.userPreferences.searchResultsCount
    );

    const handleNhsNumberSearch = (nhsNumber: string) => {
        dispatch(nhsNumberSearch(nhsNumber));
    };

    const handleChangeTableOptions = (
        update: PatientSearchResultsTableOptionsUpdate
    ) => {
        dispatch(changeTableOptions(update));
    };

    return (
        <>
            <QueryResultsSummary
                queryArguments={queryArguments}
                postcodeSearchArguments={postcodeSearchArguments}
            />
            <QueryResultsSearchTips
                searchType={searchType}
                queryArguments={queryArguments}
                postcodeSearchArguments={postcodeSearchArguments}
                resultsCount={resultCount}
            />
            {props.sentinel}
            <QueryResultsTable
                queryResults={queryResults}
                nhsNumberSearch={handleNhsNumberSearch}
                paginationPreference={paginationPreference}
                changeTableOptions={handleChangeTableOptions}
            />
        </>
    );
};
