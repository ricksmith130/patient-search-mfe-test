import {
    Button,
    Fieldset,
    Form,
    HintText,
    Radios,
    TextInput,
} from "nhsuk-react-components";
import React, {
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { DateInputMethods } from "ncrs-host/DateConstants";
import { BASIC_SEARCH_LABEL_ID } from "ncrs-host/FormIdConstants";
import {
    BASIC_SEARCH_CLEAR_BUTTON_ID,
    BASIC_SEARCH_FORM_DOB_ID,
    BASIC_SEARCH_FORM_GENDER_ID,
    BASIC_SEARCH_FORM_GENDER_LABEL_ID,
    BASIC_SEARCH_FORM_ID,
    BASIC_SEARCH_FORM_SURNAME_ID,
} from "ncrs-host/IdConstants";
import { REGEX_PARTIAL_DATE } from "ncrs-host/SingleDateInputRegExps";
import { CLEAR } from "ncrs-host/GenericStrings";
import { GENDER_SEARCH_VALUES } from "ncrs-host/Vocabulary";
import { OnEnterPressed } from "ncrs-host/AccessibilityHelpers";
import { asyncFocus } from "ncrs-host/FocusHelpers";
import { validateState } from "ncrs-host/CommonValidators";
import { validateStringInput } from "ncrs-host/AdvancedSearchValidator";
import {
    validateMandatoryDate,
    validateSearchGender,
} from "ncrs-host/PatientSearchValidationRules";
import {
    datePartsItemContainsNonNumberChars,
    isDateBlank,
} from "ncrs-host/DateHelper";
import SingleDateInput from "ncrs-host/SingleDateInput";
import {
    datePartsToSpineDate,
    getDatePartsAsSingleInputString,
} from "ncrs-host/DateFormatter";
import FormErrorSummary, {
    FormErrorSummaryError,
} from "ncrs-host/FormErrorSummary";
import { createFindPatientConnectionWarningAction } from "ncrs-host/ModalActionCreator";
import { runBasicQuery as runBasicQueryAction } from "ncrs-host/BasicSearchQueryActionCreator";
import {
    resetFormState as resetFormStateAction,
    updateFormState as updateFormStateAction,
} from "ncrs-host/SaveQueryActionCreator";
import { useAppDispatch, useAppSelector } from "ncrs-host/store";
import { getEmptyDateParts } from "ncrs-host/SampleEmptyStates";
import {
    DateParts,
    FindPatientStates,
    QueryArguments,
    SearchFormUpdate,
} from "ncrs-host/AppStateTypes";
import {
    InputData,
    InputDataWithComponentValidation,
} from "ncrs-host/BasicTypes";
import { BASIC_SEARCH_FIND_A_PATIENT, BASIC_SEARCH_HEADER, BASIC_SEARCH_HINT, PATIENT_SEARCH_DOB_LABEL, PATIENT_SEARCH_GENDER_FEMALE_LABEL, PATIENT_SEARCH_GENDER_LABEL, PATIENT_SEARCH_GENDER_MALE_LABEL, PATIENT_SEARCH_SURNAME_LABEL } from "../constants/FindPatientStrings";


export type Props = {
    internetConnection?: boolean;
    findPatientFormState?: FindPatientStates;
    runBasicQuery?: (q: QueryArguments) => {};
    showNoConnectionModal?: () => {};
    updateFormState?: (state: SearchFormUpdate) => {};
    resetFormState?: () => {};
};

export type State = {
    isValid: boolean;
    inputs: {
        gender: InputData<string>;
        surname: InputData<string>;
        dobFrom: InputDataWithComponentValidation<DateParts<string>>;
    };
};

const handlePartialDate = (maybeDate: DateParts<string>): DateParts<string> => {
    if (
        REGEX_PARTIAL_DATE.exec(maybeDate.year) &&
        !maybeDate.month &&
        !maybeDate.day
    ) {
        return { day: "01", month: "01", year: maybeDate.year };
    }
    return maybeDate;
};

const createInitialInputs = (
    findPatientFormState: FindPatientStates
): State["inputs"] => ({
    gender: { value: findPatientFormState.gender, validationErrorReason: "" },
    surname: { value: findPatientFormState.surname, validationErrorReason: "" },
    dobFrom: {
        value: handlePartialDate(findPatientFormState.dobFrom),
        validationErrorReason: "",
    },
});

const toQueryArguments = (data: State["inputs"]): QueryArguments => ({
    dobFrom:
        datePartsItemContainsNonNumberChars(data.dobFrom.value) ? "" : (
            datePartsToSpineDate(data.dobFrom.value)
        ),
    gender: data.gender.value,
    surname: data.surname.value,
});

const BasicSearchForm: React.FC<Props> = (props) => {
    const dispatch = useAppDispatch();

    // Get state from Redux
    const internetConnectionFromState = useAppSelector(
        (state: any) => state.connection.internetConnection
    );
    const findPatientFormStateFromState = useAppSelector(
        (state: any) => state.findPatient
    );

    // Use props if provided (for testing), otherwise use state
    const internetConnection =
        props.internetConnection ?? internetConnectionFromState;
    const findPatientFormState =
        props.findPatientFormState ?? findPatientFormStateFromState;

    // Create action dispatchers
    const runBasicQuery =
        props.runBasicQuery ??
        ((q: QueryArguments) => dispatch(runBasicQueryAction(q)));
    const updateFormState =
        props.updateFormState ??
        ((state: SearchFormUpdate) => dispatch(updateFormStateAction(state)));
    const resetFormState =
        props.resetFormState ?? (() => dispatch(resetFormStateAction()));
    const showNoConnectionModal =
        props.showNoConnectionModal ??
        (() => dispatch(createFindPatientConnectionWarningAction()));

    const [state, setState] = useState<State>(() => ({
        isValid: false,
        inputs: createInitialInputs(findPatientFormState),
    }));

    // Focus once on mount
    useEffect(() => {
        asyncFocus(BASIC_SEARCH_FORM_ID);
    }, []);

    // Keep local state in sync if findPatientFormState changes
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            inputs: createInitialInputs(findPatientFormState),
        }));
    }, [findPatientFormState]);

    const formatDateForStore = useCallback(
        (formDate: DateParts<string>): DateParts<string> => {
            const initialDob = findPatientFormState.dobFrom;
            if (
                REGEX_PARTIAL_DATE.exec(initialDob.year) &&
                initialDob.year === formDate.year &&
                !initialDob.month &&
                !initialDob.day &&
                formDate.month === "01" &&
                formDate.day === "01"
            ) {
                const paddedDate = getEmptyDateParts();
                paddedDate.year = formDate.year;
                return paddedDate;
            }
            return formDate;
        },
        [findPatientFormState.dobFrom]
    );

    const saveFormState = useCallback(() => {
        const formstate: SearchFormUpdate = {
            dobFrom: formatDateForStore(state.inputs.dobFrom.value),
            gender: state.inputs.gender.value,
            surname: state.inputs.surname.value,
            dateInputMethods: {
                ...findPatientFormState.dateInputMethods,
            },
        };

        if (
            datePartsToSpineDate(state.inputs.dobFrom.value) &&
            isDateBlank(findPatientFormState.dobTo) &&
            formstate.dateInputMethods
        ) {
            formstate.dateInputMethods.dob = DateInputMethods.SingleDate;
        }

        updateFormState(formstate);
    }, [
        formatDateForStore,
        findPatientFormState,
        state.inputs,
        updateFormState,
    ]);

    const handleGenderChange = useCallback(
        (event: any) => {
            event.stopPropagation();
            const { value } = event.target as HTMLInputElement;
            setState((s) => ({
                ...s,
                inputs: { ...s.inputs, gender: { ...s.inputs.gender, value } },
            }));
        },
        []
    );

    const handleSurnameChange = useCallback(
        (event: SyntheticEvent<HTMLInputElement>) => {
            event.preventDefault();
            event.stopPropagation();
            const { value } = event.currentTarget;
            setState((s) => ({
                ...s,
                inputs: {
                    ...s.inputs,
                    surname: { ...s.inputs.surname, value },
                },
            }));
        },
        []
    );

    const handleDobChange = useCallback(
        (date: InputData<DateParts<string>>) => {
            setState((s) => ({
                ...s,
                inputs: {
                    ...s.inputs,
                    dobFrom: {
                        ...s.inputs.dobFrom,
                        value: date.value,
                        componentValidationErrorReason:
                            date.validationErrorReason,
                    },
                },
            }));
        },
        []
    );

    const buildErrors = useCallback(
        (inputs: State["inputs"]): Array<FormErrorSummaryError> => {
            const ids: Record<keyof State["inputs"], string> = {
                gender: BASIC_SEARCH_FORM_GENDER_ID,
                surname: BASIC_SEARCH_FORM_SURNAME_ID,
                dobFrom: BASIC_SEARCH_FORM_DOB_ID,
            };
            return (Object.keys(ids) as Array<keyof State["inputs"]>)
                .filter((k) => inputs[k].validationErrorReason)
                .map((k) => ({
                    error: `${inputs[k].validationErrorReason}`,
                    element: ids[k],
                    focus: true,
                }));
        },
        []
    );

    const onSubmit = useCallback(
        (event: SyntheticEvent<HTMLFormElement>) => {
            event.preventDefault();
            event.stopPropagation();

            if (!internetConnection) {
                showNoConnectionModal();
                return;
            }

            const { dobFrom, gender, surname } = state.inputs;

            const updatedInputs: State["inputs"] = {
                dobFrom: validateMandatoryDate(
                    dobFrom.value,
                    PATIENT_SEARCH_DOB_LABEL
                ),
                gender: validateSearchGender(gender.value),
                surname: validateStringInput("surname", surname.value),
            };

            if (
                dobFrom.componentValidationErrorReason &&
                !updatedInputs.dobFrom.validationErrorReason
            ) {
                updatedInputs.dobFrom.validationErrorReason =
                    dobFrom.componentValidationErrorReason;
            }

            const isValid = validateState(updatedInputs);

            setState((s) => ({ ...s, inputs: updatedInputs, isValid }));
            if (isValid) {
                saveFormState();
                runBasicQuery(toQueryArguments(updatedInputs));
            }
        },
        [
            internetConnection,
            showNoConnectionModal,
            saveFormState,
            state.inputs,
            runBasicQuery,
        ]
    );

    const errors = useMemo(
        () => buildErrors(state.inputs),
        [
            buildErrors,
            state.inputs.gender.validationErrorReason,
            state.inputs.surname.validationErrorReason,
            state.inputs.dobFrom.validationErrorReason,
        ]
    );

    return (
        <div className="patient-search-form">
            <FormErrorSummary errors={errors} />
            <Form
                id={BASIC_SEARCH_FORM_ID}
                noValidate
            >
                <h2
                    className="nhsuk-heading-m nhsuk-u-margin-bottom-1 no-outline"
                    id={BASIC_SEARCH_LABEL_ID}
                    tabIndex={-1}
                >
                    {BASIC_SEARCH_HEADER}
                </h2>
                <HintText>{BASIC_SEARCH_HINT}</HintText>

                <div className="patient-search-form__field-group">
                    <Fieldset>
                        <Fieldset.Legend
                            id={BASIC_SEARCH_FORM_GENDER_LABEL_ID}
                            className="form-label"
                        >
                            {PATIENT_SEARCH_GENDER_LABEL}
                        </Fieldset.Legend>
                        <Radios
                            onChange={handleGenderChange}
                            name="gender"
                            id={BASIC_SEARCH_FORM_GENDER_ID}
                            inline
                            error={state.inputs.gender.validationErrorReason}
                        >
                            <Radios.Item
                                value={GENDER_SEARCH_VALUES.female}
                                checked={
                                    state.inputs.gender.value ===
                                    GENDER_SEARCH_VALUES.female
                                }
                            >
                                {PATIENT_SEARCH_GENDER_FEMALE_LABEL}
                            </Radios.Item>
                            <Radios.Item
                                value={GENDER_SEARCH_VALUES.male}
                                checked={
                                    state.inputs.gender.value ===
                                    GENDER_SEARCH_VALUES.male
                                }
                            >
                                {PATIENT_SEARCH_GENDER_MALE_LABEL}
                            </Radios.Item>
                        </Radios>
                    </Fieldset>
                </div>

                <div className="patient-search-form__field-group">
                    <TextInput
                        label={PATIENT_SEARCH_SURNAME_LABEL}
                        labelProps={{ className: "form-label" }}
                        name="surname"
                        id={BASIC_SEARCH_FORM_SURNAME_ID}
                        autoComplete="off"
                        width="20"
                        onChange={handleSurnameChange}
                        value={state.inputs.surname.value}
                        error={state.inputs.surname.validationErrorReason}
                    />
                </div>

                <div className="patient-search-form__field-group">
                    <SingleDateInput
                        isExactDateOnly
                        id={BASIC_SEARCH_FORM_DOB_ID}
                        label={PATIENT_SEARCH_DOB_LABEL}
                        name="dobFrom"
                        value={getDatePartsAsSingleInputString(
                            state.inputs.dobFrom.value
                        )}
                        handleChange={handleDobChange}
                        error={state.inputs.dobFrom.validationErrorReason}
                    />
                </div>

                <div className="button-group-section">
                    <Button
                        className="patient-search-form__button"
                        type="submit"
                        onClick={(e: any) => onSubmit(e)}
                    >
                        {BASIC_SEARCH_FIND_A_PATIENT}
                    </Button>
                    <p className="search-form-clear-link">
                        <a
                            id={BASIC_SEARCH_CLEAR_BUTTON_ID}
                            tabIndex={0}
                            role="button"
                            onClick={(e) => {
                                e.preventDefault();
                                resetFormState();
                            }}
                            onKeyDown={OnEnterPressed((e) => {
                                e.preventDefault();
                                resetFormState();
                            })}
                        >
                            {CLEAR}
                        </a>
                    </p>
                </div>
            </Form>
        </div>
    );
};

export default BasicSearchForm;
