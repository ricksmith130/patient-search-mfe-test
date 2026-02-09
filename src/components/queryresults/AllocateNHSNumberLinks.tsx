import {
    ALLOCATE_NHS_NUMBER_LINK_ID,
    BNA_ACTION_LINK_ID,
} from "ncrs-host/IdConstants";
import { useSkipLink } from "ncrs-host/UseSkipLink";
import { OnEnterPressed } from "ncrs-host/AccessibilityHelpers";
import { navigateToBnaNotifierTab } from "ncrs-host/BnaActionCreator";
import {
    navigateToAllocateNhsViewAction,
    navigateToCreateBirthNotificationViewAction,
} from "ncrs-host/NavigationActions";
import { useAppDispatch, useAppSelector } from "ncrs-host/store";
import {
    PSR_ALLOCATE_NHS_NUMBER,
    PSR_CREATE_BIRTH_NOTIFICATION,
    PSR_QUERY_HELP_ALLOCATE,
    PSR_REFINE_START_AGAIN,
} from "ncrs-host/PatientSearchResultsStrings";

const AllocateNHSNumberLinks: React.FC = () => {
    const dispatch = useAppDispatch();
    const canCreateBirthNotifications = useAppSelector(
        (state: any) =>
            state.userDetails.currentProfile
                .birthNotificationAccessLevel === "CREATE"
    );

    useSkipLink("#allocate-link");

    function navigateToBna() {
        dispatch(navigateToCreateBirthNotificationViewAction());
        dispatch(navigateToBnaNotifierTab());
    }

    const showAllocateNhsNumberAndCreateBna = canCreateBirthNotifications;

    return (
        <span>
            {showAllocateNhsNumberAndCreateBna && (
                <>
                    {PSR_QUERY_HELP_ALLOCATE}
                    <a
                        id={ALLOCATE_NHS_NUMBER_LINK_ID}
                        tabIndex={0}
                        role="button"
                        onClick={(event) => {
                            event.preventDefault();
                            dispatch(navigateToAllocateNhsViewAction());
                        }}
                        onKeyDown={OnEnterPressed((event: any) => {
                            event.preventDefault();
                            dispatch(navigateToAllocateNhsViewAction());
                        })}
                    >
                        {PSR_ALLOCATE_NHS_NUMBER}
                    </a>
                    <span>{PSR_REFINE_START_AGAIN}</span>
                    <a
                        id={BNA_ACTION_LINK_ID}
                        tabIndex={0}
                        role="button"
                        onClick={(event) => {
                            event.preventDefault();
                            navigateToBna();
                        }}
                        onKeyDown={OnEnterPressed((event: any) => {
                            event.preventDefault();
                            navigateToBna();
                        })}
                    >
                        {PSR_CREATE_BIRTH_NOTIFICATION}
                    </a>
                </>
            )}
        </span>
    );
};

export default AllocateNHSNumberLinks;
