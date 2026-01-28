import { TabSet } from "nhsuk-react-components-extensions";
import React from "react";

import {
    ADVANCED_SEARCH_TAB_ID,
    BASIC_SEARCH_TAB_ID,
    NHS_NUMBER_SEARCH_TAB_ID,
    POSTCODE_SEARCH_TAB_ID,
} from "ncrs-host/IdConstants";
import {
    ADVANCED_SEARCH,
    BASIC_SEARCH,
    NHS_NUMBER_SEARCH,
    POSTCODE_SEARCH,
} from "ncrs-host/findTabsConstants";
import { useAppState } from "ncrs-host/useAppState";
import { SimulateClickEvent } from "ncrs-host/AccessibilityHelpers";
import { hasValidRole } from "ncrs-host/PostcodeSearchHelpers";
import {
    activateAdvancedSearchTab,
    activateBasicSearchTab,
    activateNHSNumberSearchTab,
    activatePostcodeSearchTab,
} from "ncrs-host/TabActionCreator";
import { useAppDispatch } from "ncrs-host/store";
import {
    FIND_PATIENT_ADVANCED_DETAILS,
    FIND_PATIENT_ADVANCED_DETAILS_LABEL,
    FIND_PATIENT_BASIC_DETAILS,
    FIND_PATIENT_BASIC_DETAILS_LABEL,
    FIND_PATIENT_NHS_NUMBER,
    FIND_PATIENT_NHS_NUMBER_LABEL,
    FIND_PATIENT_POSTCODE,
    FIND_PATIENT_POSTCODE_LABEL,
} from "ncrs-host/FindPatientStrings";

type FindPatientTabsProps = {};

export const removeFocusFromElement = (id: string) => {
    document.getElementById(id)?.blur();
};

const FindPatientTabs: React.FC<FindPatientTabsProps> = () => {
    const selectedTab = useAppState(
        (state: any) => state.uiState.tabState.selectedSearchTab
    );
    const userPermissions = useAppState((state: any) => state.uiState.userDetails);
    const dispatch = useAppDispatch();
    return (
        <TabSet className="find-patient-tabset">
            <div className="find-patient-tabset__container">
                <TabSet.Tab
                    id={NHS_NUMBER_SEARCH_TAB_ID}
                    active={selectedTab === NHS_NUMBER_SEARCH}
                    onClick={() => dispatch(activateNHSNumberSearchTab())}
                    onKeyDown={SimulateClickEvent}
                    aria-label={FIND_PATIENT_NHS_NUMBER_LABEL}
                >
                    {FIND_PATIENT_NHS_NUMBER}
                </TabSet.Tab>

                <TabSet.Tab
                    id={BASIC_SEARCH_TAB_ID}
                    active={selectedTab === BASIC_SEARCH}
                    onClick={() => {
                        console.log("BASIC_SEARCH");
                        dispatch(activateBasicSearchTab());
                        removeFocusFromElement(BASIC_SEARCH_TAB_ID);
                    }}
                    onKeyDown={SimulateClickEvent}
                    aria-label={FIND_PATIENT_BASIC_DETAILS_LABEL}
                >
                    {FIND_PATIENT_BASIC_DETAILS}
                </TabSet.Tab>

                <TabSet.Tab
                    id={ADVANCED_SEARCH_TAB_ID}
                    active={selectedTab === ADVANCED_SEARCH}
                    onClick={() => {
                        dispatch(activateAdvancedSearchTab());
                        removeFocusFromElement(ADVANCED_SEARCH_TAB_ID);
                    }}
                    onKeyDown={SimulateClickEvent}
                    aria-label={FIND_PATIENT_ADVANCED_DETAILS_LABEL}
                >
                    {FIND_PATIENT_ADVANCED_DETAILS}
                </TabSet.Tab>

                {hasValidRole(userPermissions) ?
                    <TabSet.Tab
                        id={POSTCODE_SEARCH_TAB_ID}
                        active={selectedTab === POSTCODE_SEARCH}
                        onClick={() => {
                            dispatch(activatePostcodeSearchTab());
                            removeFocusFromElement(POSTCODE_SEARCH_TAB_ID);
                        }}
                        onKeyDown={SimulateClickEvent}
                        aria-label={FIND_PATIENT_POSTCODE_LABEL}
                    >
                        {FIND_PATIENT_POSTCODE}
                    </TabSet.Tab>
                :   <></>}
            </div>
        </TabSet>
    );
};

export default FindPatientTabs;
