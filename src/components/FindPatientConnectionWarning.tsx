import { NO_CONNECTION_PATIENT_SEARCH } from "ncrs-host/Modals";
import {
    CONNECTION_WARNING_MODAL_BODY,
    CONNECTION_WARNING_MODAL_TITLE,
} from "ncrs-host/PatientDashboardStrings";
import GenericModal from "ncrs-host/GenericModal";
import ConnectionWarningCloseButton from "ncrs-host/ConnectionWarningCloseButton";
import { createCloseModalAction } from "ncrs-host/ModalActionCreator";
import { useAppDispatch, useAppSelector } from "ncrs-host/store";

const Body = () => <p>{CONNECTION_WARNING_MODAL_BODY}</p>;

const FindPatientConnectionWarning: React.FC = () => {
    const dispatch = useAppDispatch();
    const isVisible = useAppSelector(
        (state: any) =>
            state.modals.activeModal === NO_CONNECTION_PATIENT_SEARCH
    );
    const internetConnection = useAppSelector(
        (state: any) => state.connection.internetConnection
    );

    const closeModal = () => dispatch(createCloseModalAction());

    return (
        <GenericModal
            isVisible={isVisible && !internetConnection}
            closeModalFunction={closeModal}
            shouldCloseOnOverlayClick={true}
            headerContent={CONNECTION_WARNING_MODAL_TITLE}
            bodyContent={<Body />}
            buttons={[
                <ConnectionWarningCloseButton
                    closeModal={closeModal}
                    key={"close"}
                />,
            ]}
        />
    );
};

export default FindPatientConnectionWarning;
