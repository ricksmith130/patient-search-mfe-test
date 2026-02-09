import React, { PropsWithChildren, useCallback, useMemo } from "react";

import {
    NAVIGATE_BACK_WARNING,
    NO_MODAL,
    SPINNER,
} from "ncrs-host/Modals";
import { BackWarningViewWrapper } from "ncrs-host/BackViewBase";
import {
    createCloseModalAction,
    createCloseModalAndCancelFetchAction,
    createOpenBackNavigationModalAction,
} from "ncrs-host/ModalActionCreator";
import { navigateToPatientSearchAction } from "ncrs-host/NavigationActions";
import { useAppDispatch, useAppSelector } from "ncrs-host/store";
import {
    historyNavIntercept,
    modalNavIntercept,
    navigationHook,
} from "ncrs-host/NavigationHooks";
import type { AppState } from "ncrs-host/AppStateTypes";
import { NAVIGATION_WARNING_QUESTION_SEARCH_RESULTS } from "ncrs-host/NavigationWarningStrings";

const SearchResultsNavigation: React.FC<PropsWithChildren> = ({ children }) => {
    const dispatch = useAppDispatch();

    const isModalActive = useAppSelector(
        (state: AppState) =>
            state.modals.activeModal !== NAVIGATE_BACK_WARNING &&
            state.modals.activeModal !== SPINNER &&
            state.modals.activeModal !== NO_MODAL
    );

    const internetConnection = useAppSelector(
        (state: AppState) => state.connection.internetConnection
    );

    const titleText = NAVIGATION_WARNING_QUESTION_SEARCH_RESULTS;

    const closeModal = useCallback(
        () => dispatch(createCloseModalAction()),
        [dispatch]
    );

    const backNavigation = useCallback(
        () => navigateToPatientSearchAction(),
        [dispatch]
    );

    const navigationHooks = useMemo(
        () => [
            navigationHook(
                dispatch,
                modalNavIntercept,
                createCloseModalAndCancelFetchAction
            ),
            navigationHook(
                dispatch,
                historyNavIntercept,
                createOpenBackNavigationModalAction
            ),
        ],
        [dispatch]
    );

    return (
        <BackWarningViewWrapper
            isModalActive={isModalActive}
            internetConnection={internetConnection}
            titleText={titleText}
            closeModal={closeModal}
            backNavigation={backNavigation}
            navigationHooks={navigationHooks}
        >
            {children}
        </BackWarningViewWrapper>
    );
};

export default SearchResultsNavigation;
