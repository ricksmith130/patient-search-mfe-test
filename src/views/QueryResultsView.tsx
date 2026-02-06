import { Container } from "nhsuk-react-components";
import React from "react";
import { connect } from "react-redux";

// @ts-ignore - Federated module
import { PATIENT_VIEW_SENTINEL_ID } from "ncrs-host/IdConstants";
import {
    PSR_RESULT_COUNT_NONE,
    PSR_RESULT_COUNT_OVER_MAX,
} from "../constants/PatientSearchResultsStrings";
// @ts-ignore - Federated module
import { AppState } from "ncrs-host/AppStateTypes";
// @ts-ignore - Federated module
import Sentinel from "ncrs-host/Sentinel";
// @ts-ignore - Federated module
import TopButton from "ncrs-host/TopButton";
// @ts-ignore - Federated module
import { NavigationWarningBackContainer } from "ncrs-host/NavigationWarning";
// @ts-ignore - Federated module
import PatientRetrievalBlocked from "ncrs-host/PatientRetrievalBlocked";
// @ts-ignore - Federated module
import withIntersectionObserver from "ncrs-host/IntersectionObserver";
import { QueryResultsContent } from "../components/queryresults/QueryResultsContent";
// @ts-ignore - Federated module
import SearchResultsNavigation from "ncrs-host/SearchResultsNavigation";
// @ts-ignore - Federated module
import { PATIENT_SEARCH_RESULTS_TITLE } from "ncrs-host/SearchTitles";
// @ts-ignore - Federated module
import { NHS_NUMBER_RETRIEVAL_BLOCKED_FROM_SEARCH_PAGE } from "ncrs-host/PatientNotFoundStrings";

type QueryResultsProps = {
    observerRefCallback: React.RefObject<HTMLDivElement>;
    resultCount: number;
    queryType: string;
};

type State = {
    topButtonVisible: boolean;
};

class QueryResultsView extends React.Component<QueryResultsProps, State> {
    constructor(props: QueryResultsProps) {
        super(props);
        this.state = {
            topButtonVisible: false,
        };
    }

    componentDidMount() {
        window.document.title = PATIENT_SEARCH_RESULTS_TITLE;
    }

    handleIntersection = (entry: any) => {
        const floatsVisible: boolean = entry.intersectionRatio < 1;
        this.setState({
            topButtonVisible: floatsVisible,
        });
    };

    render = () => {
        const { resultCount } = this.props;
        const { queryType } = this.props;
        const capitalizedQueryType =
            queryType.charAt(0).toUpperCase() + queryType.slice(1);
        let queryResultsHeaderText = "";

        if (resultCount == 0) {
            queryResultsHeaderText = PSR_RESULT_COUNT_NONE;
        } else if (resultCount == -1) {
            queryResultsHeaderText = PSR_RESULT_COUNT_OVER_MAX;
        } else if (resultCount == 1) {
            queryResultsHeaderText = `${resultCount} ${capitalizedQueryType} Search Result`;
        } else {
            queryResultsHeaderText = `${resultCount} ${capitalizedQueryType} Search Results`;
        }

        return (
            <>
                <SearchResultsNavigation>
                    <NavigationWarningBackContainer />
                </SearchResultsNavigation>
                <PatientRetrievalBlocked
                    returnButtonText={
                        NHS_NUMBER_RETRIEVAL_BLOCKED_FROM_SEARCH_PAGE
                    }
                />
                <div
                    className="query-results-header"
                    tabIndex={-1}
                >
                    <div className="nhsuk-hero">
                        <Container
                            fluid
                            className="query-results-container"
                        >
                            <div className="nhsuk-hero__wrapper">
                                <h1 className="nhsuk-u-margin-bottom-3">
                                    {queryResultsHeaderText}
                                </h1>
                            </div>
                        </Container>
                    </div>
                </div>
                <Container
                    fluid
                    className="query-results-container"
                >
                    <QueryResultsContent
                        sentinel={
                            <Sentinel
                                id={PATIENT_VIEW_SENTINEL_ID}
                                observerRefCallback={
                                    this.props.observerRefCallback
                                }
                            />
                        }
                    />
                    <TopButton visible={this.state.topButtonVisible} />
                </Container>
            </>
        );
    };
}

const mapStateToProps = (state: AppState) => {
    return {
        resultCount: state.query.queryResults.resultsCount,
        queryType: state.query.queryType,
    };
};

// export default connect(mapStateToProps)(QueryResultsView);
export default connect(mapStateToProps)(
    withIntersectionObserver(QueryResultsView)
);
