import { Button, Form, HintText } from "nhsuk-react-components";
import { InputMask as MaskedInput } from "nhsuk-react-components-extensions";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { NHS_NUMBER_SEARCH_LABEL_ID } from "ncrs-host/FormIdConstants";
import {
    NHS_NUMBER_HINT_ID,
    NHS_NUMBER_SEARCH_FORM_NHS_NUMBER_ID,
    NHS_NUMBER_SUBMIT_ID,
} from "ncrs-host/IdConstants";
import { asyncInputFocus } from "ncrs-host/FocusHelpers";
import { useAppState } from "ncrs-host/useAppState";
import isValid from "ncrs-host/NhsNumberValidator";
import FormErrorSummary from "ncrs-host/FormErrorSummary";
import { createFindPatientConnectionWarningAction } from "ncrs-host/ModalActionCreator";
import { nhsNumberSearch } from "ncrs-host/NhsNumberQueryActionCreator";
import { useAppDispatch } from "ncrs-host/store";
import { SEARCH_BY } from "ncrs-host/CommonStrings";
import { NHS_NUM_SEARCH_TOO_SHORT, NHS_NUM_SEARCH_INVALID, NHS_NUM_SEARCH_LABEL, NHS_NUM_SEARCH_EXAMPLE, NHS_NUM_SEARCH_FIND_A_PATIENT } from "../constants/FindPatientStrings";

const validateNhsNumber = (nhsNumber: string) => {
    if (nhsNumber.length !== 10) {
        return NHS_NUM_SEARCH_TOO_SHORT;
    } else if (!isValid(nhsNumber)) {
        return NHS_NUM_SEARCH_INVALID;
    }
    return "";
};

const NhsNumberSearchForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const deepLink = useAppState((state: any) => state.deepLink);
    const token = useAppState(
        (state: any) => state.patientSearch.searchToken
    );
    const internetConnection = useAppState(
        (state: any) => state.connection.internetConnection
    );
    const [validationError, setValidationError] = useState<string>("");
    const [searchToken, setSearchToken] = useState<string>(token || "");
    useEffect(() => {
        if (deepLink?.nhsNumber) {
            dispatch(nhsNumberSearch(deepLink.nhsNumber));
        } else {
            // Auto-focus on NHS field
            asyncInputFocus(NHS_NUMBER_SEARCH_FORM_NHS_NUMBER_ID);
        }
    }, []);

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!internetConnection) {
            dispatch(createFindPatientConnectionWarningAction());
            return;
        }
        const sanitisedToken = searchToken.replace(/\s/g, "");
        const validationFailure = validateNhsNumber(sanitisedToken);
        if (validationFailure) {
            setValidationError(validationFailure);
        } else {
            dispatch(nhsNumberSearch(sanitisedToken));
        }
    };

    const errors =
        validationError ?
            [
                {
                    error: validationError,
                    element: "nhs-number-search-form-nhs-number",
                },
            ]
        :   [];

    return (
        <div className="patient-search-form">
            <FormErrorSummary errors={errors} />
            <Form
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="patient-search-form__field-group">
                    <h2
                        className="nhsuk-heading-m nhsuk-u-margin-bottom-1 no-outline"
                        tabIndex={-1}
                        id={NHS_NUMBER_SEARCH_LABEL_ID}
                    >
                        <span className="nhsuk-u-visually-hidden">
                            {SEARCH_BY}
                        </span>
                        {NHS_NUM_SEARCH_LABEL}
                    </h2>
                    <HintText id={NHS_NUMBER_HINT_ID}>
                        {NHS_NUM_SEARCH_EXAMPLE}
                    </HintText>
                    <MaskedInput
                        label=""
                        labelProps={{ className: "nhsuk-u-visually-hidden" }}
                        name="nhsnumber"
                        id={NHS_NUMBER_SEARCH_FORM_NHS_NUMBER_ID}
                        aria-labelledby={NHS_NUMBER_SEARCH_LABEL_ID}
                        aria-describedby={NHS_NUMBER_HINT_ID}
                        width="10"
                        autoComplete="off"
                        mask="### ### ####"
                        formatChars={{
                            "#": "[0-9]",
                        }}
                        type="tel"
                        maskChar=""
                        onChange={(e: React.ChangeEvent<any>) =>
                            setSearchToken(e.currentTarget.value)
                        }
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            if (e.currentTarget.value === "") {
                                setSearchToken("");
                            }
                        }}
                        alwaysShowMask={false}
                        error={validationError}
                        value={searchToken}
                    />
                </div>
                <Button
                    className="patient-search-form__button"
                    type="submit"
                    id={NHS_NUMBER_SUBMIT_ID}
                >
                    {NHS_NUM_SEARCH_FIND_A_PATIENT}
                </Button>
            </Form>
        </div>
    );
};
export default NhsNumberSearchForm;
