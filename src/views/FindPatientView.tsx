import { Container, Hero } from "nhsuk-react-components";
import React, { lazy, Suspense, useEffect } from "react";

import { NHS_NUMBER_SEARCH } from "ncrs-host/findTabsConstants";
import { initialiseRefreshCheck } from "ncrs-host/initialiseRefreshCheck";
import { useAppState } from "ncrs-host/useAppState";
import { useSkipLink } from "ncrs-host/useSkipLink";
// import Bulletins from "ncrs-host/Bulletins"; // TODO: Temporarily disabled
import PatientRetrievalBlocked from "ncrs-host/PatientRetrievalBlocked";
import { SelectedSearchViewTab } from "ncrs-host/AppStateTypes";
import FindPatientConnectionWarning from "../components/FindPatientConnectionWarning";
import ConnectedPatientNotFound from "../components/PatientNotFound";
import {
    ADVANCED_SEARCH_TITLE,
    BASIC_SEARCH_TITLE,
    NHS_NUMBER_SEARCH_TITLE,
    POSTCODE_SEARCH_TITLE,
} from "../constants/SearchTitles";
import { NO_NHS_NUMBER_FOUND_BUTTON_TEXT } from "../constants/PatientNotFoundStrings";
import { FIND_PATIENT_PAGE_HEADER } from "../constants/FindPatientStrings";
import FindPatientTabs from "../components/FindPatientTabs";
import NhsNumberSearchForm from "../components/NhsNumberSearchForm";
import BasicSearchForm from "../components/BasicSearchForm";
import AdvancedSearchForm from "../components/AdvancedSearchForm";
import PostcodeSearchForm from "../components/PostcodeSearchForm";

const tabDispatch = {
    NHS_NUMBER_SEARCH: NhsNumberSearchForm,
    BASIC_SEARCH: BasicSearchForm,
    ADVANCED_SEARCH: AdvancedSearchForm,
    POSTCODE_SEARCH: PostcodeSearchForm,
};

const evaluateTab = (tabKey?: SelectedSearchViewTab) =>
    tabKey ? tabDispatch[tabKey] : tabDispatch[NHS_NUMBER_SEARCH];

const FindPatientView: React.FC = () => {
    initialiseRefreshCheck();
    const selectedTab = useAppState(
        (state: any) => state.tabState.selectedSearchTab
    );
    const RenderedTab = evaluateTab(selectedTab);

    useEffect(() => {
        switch (selectedTab) {
            case "NHS_NUMBER_SEARCH":
                window.document.title = NHS_NUMBER_SEARCH_TITLE;
                break;
            case "BASIC_SEARCH":
                window.document.title = BASIC_SEARCH_TITLE;
                break;
            case "ADVANCED_SEARCH":
                window.document.title = ADVANCED_SEARCH_TITLE;
                break;
            case "POSTCODE_SEARCH":
                window.document.title = POSTCODE_SEARCH_TITLE;
                break;
        }
    }, [selectedTab]);

    useEffect(() => window.scroll(0, 0), []);

    useSkipLink(".find-a-patient");

    return (
        <div
            id="find-a-patient"
            className="find-a-patient"
            tabIndex={-1}
        >
            <ConnectedPatientNotFound />
            <PatientRetrievalBlocked
                returnButtonText={NO_NHS_NUMBER_FOUND_BUTTON_TEXT}
            />
            <FindPatientConnectionWarning />
            <div className="above-tab-space">
                <Hero>
                    <Hero.Heading>{FIND_PATIENT_PAGE_HEADER}</Hero.Heading>
                </Hero>
            </div>
            <FindPatientTabs />

            <Container className="patient-search-form-container ">
                <Suspense fallback={null}>
                    <main>
                        <div className="find-patient-grid">
                            <div className="find-patient-grid__form">
                                <RenderedTab />
                            </div>
                            {/* TODO: Bulletins temporarily disabled - needs conditional logic
                            <div className="find-patient-grid__bulletins">
                                <Bulletins />
                            </div>
                            */}
                        </div>
                    </main>
                </Suspense>
            </Container>
        </div>
    );
};

export default FindPatientView;
