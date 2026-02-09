import { Button } from "nhsuk-react-components";
import React from "react";
import { Col } from "react-grid-system";

import { NOT_FOUND_RETURN_LINK_ID } from "ncrs-host/IdConstants";
import { NO_PATIENT_FOUND } from "ncrs-host/Modals";
import GenericModal from "ncrs-host/GenericModal";
import { createCloseModalAction } from "ncrs-host/ModalActionCreator";
import { useAppDispatch, useAppSelector } from "ncrs-host/store";
import {
    NO_NHS_NUMBER_FOUND_BUTTON_TEXT,
    NO_NHS_NUMBER_FOUND_MESSAGE,
    NO_NHS_NUMBER_FOUND_TITLE,
} from "../constants/PatientNotFoundStrings";

const Body = () => <p>{NO_NHS_NUMBER_FOUND_MESSAGE}</p>;

const ReturnButton: React.FC<{ onCloseClick: Function }> = (props) => (
    <Col
        md={6}
        sm={6}
    >
        <Button
            className="modal-message__action-button"
            role="button"
            onClick={() => {
                props.onCloseClick();
            }}
            id={NOT_FOUND_RETURN_LINK_ID}
        >
            {NO_NHS_NUMBER_FOUND_BUTTON_TEXT}
        </Button>
    </Col>
);

const PatientNotFound: React.FC = () => {
    const dispatch = useAppDispatch();

    const isVisible = useAppSelector(
        (state: any) => state.modals.activeModal === NO_PATIENT_FOUND
    );

    const closeModal = () => dispatch(createCloseModalAction());

    return (
        <GenericModal
            isVisible={isVisible}
            closeModalFunction={closeModal}
            shouldCloseOnOverlayClick={true}
            headerContent={NO_NHS_NUMBER_FOUND_TITLE}
            bodyContent={<Body />}
            buttons={[
                <ReturnButton
                    onCloseClick={closeModal}
                    key={"return"}
                />,
            ]}
        />
    );
};

export default PatientNotFound;
