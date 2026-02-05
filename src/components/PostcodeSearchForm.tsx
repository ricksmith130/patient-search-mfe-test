import {
    Button,
    Checkboxes,
    Form,
    HintText,
    TextInput,
} from "nhsuk-react-components";
import React, {
    type ChangeEvent,
    type FormEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    DateInputMethods,
    DateInputSwitcherStringMap,
    SINGLE_DATE_INPUT_RESPONSES,
} from "ncrs-host/DateConstants";
import { POSTCODE_SEARCH_LABEL_ID } from "ncrs-host/FormIdConstants";
import {
    NAME_FORM_GROUP_ID,
    POSTCODE_FORM_GROUP_ID,
    POSTCODE_SEARCH_CLEAR_BUTTON_ID,
    POSTCODE_SEARCH_FORM_EFFECTIVE_RANGE_ID,
    POSTCODE_SEARCH_FORM_FIRST_NAME_ID,
    POSTCODE_SEARCH_FORM_ID,
    POSTCODE_SEARCH_FORM_INCLUDE_PREVIOUS_OCCUPANTS_ID,
    POSTCODE_SEARCH_FORM_POSTCODE_ID,
    POSTCODE_SEARCH_FORM_SURNAME_ID,
    POSTCODE_SEARCH_HINT_ID,
    POSTCODE_SUBMIT_ID,
} from "ncrs-host/IdConstants";

import { CLEAR } from "ncrs-host/GenericStrings";
import { OnEnterPressed } from "ncrs-host/AccessibilityHelpers";
import { asyncInputFocus } from "ncrs-host/FocusHelpers";
import { validateState } from "ncrs-host/CommonValidators";
import {
    validateDateRange,
    validateDOBDateRange,
    validateStringInput,
} from "ncrs-host/PostcodeSearchValidators";
import {
    datePartsItemContainsNonNumberChars,
    getDateInputSwitcherInputIds,
    getDateRange,
} from "ncrs-host/DateHelper";
import DateInputSwitcher from "ncrs-host/DateInputSwitcher";
import DateRangeInput from "ncrs-host/DateRangeInput";
import OSPlacesAddressFinder from "ncrs-host/OSPlacesAddressFinder";
import {
    getBlankDate,
    getDatePartsAsSingleInputString,
} from "ncrs-host/DateFormatter";
import { formatPostcode } from "ncrs-host/PostCodeFormatter";
import FormErrorSummary, {
    FormErrorSummaryError,
} from "ncrs-host/FormErrorSummary";
import { createFindPatientConnectionWarningAction } from "ncrs-host/ModalActionCreator";
import { runPostcodeQuery } from "ncrs-host/PostcodeSearchQueryActionCreator";
import {
    resetFormState,
    updateFormState,
} from "ncrs-host/SaveQueryActionCreator";
import { useAppDispatch, useAppSelector } from "ncrs-host/store";
import {
    DateParts,
    FindPatientStates,
    IgnoreHistoryIndicatorType,
    OSPlacesLookupResult,
    PostcodeSearchArguments,
} from "ncrs-host/AppStateTypes";
import {
    InputData,
    InputDataWithComponentValidation,
} from "ncrs-host/BasicTypes";
import { PATIENT_SEARCH_DOB_LABEL, PATIENT_SEARCH_DOB_RANGE_LABEL, PATIENT_SEARCH_DATE_FROM, PATIENT_SEARCH_AGE_RANGE_FROM_LABEL, PATIENT_SEARCH_DATE_TO, PATIENT_SEARCH_AGE_RANGE_TO_LABEL, POSTCODE_SEARCH_HEADER, POSTCODE_SEARCH_HINT, POSTCODE_SEARCH_POSTCODE_LABEL, POSTCODE_SEARCH_INCLUDE_PREVIOUS_OCCUPANTS, POSTCODE_SEARCH_EFFECTIVE_RANGE_LABEL, PATIENT_SEARCH_FIRST_NAME_LABEL, PATIENT_SEARCH_SURNAME_LABEL, POSTCODE_FIND_A_PATIENT, PATIENT_SEARCH_OCCUPANCY_DATE_RANGE_FROM_LABEL, PATIENT_SEARCH_OCCUPANCY_DATE_RANGE_TO_LABEL } from "../constants/FindPatientStrings";


export type Props = Record<string, never>;

export type InputsState = {
    postcode: InputData<string>;
    addressEffectiveFrom: InputDataWithComponentValidation<DateParts<string>>;
    addressEffectiveTo: InputDataWithComponentValidation<DateParts<string>>;
    firstname: InputData<string>;
    surname: InputData<string>;
    dobFrom: InputDataWithComponentValidation<DateParts<string>>;
    dobTo: InputDataWithComponentValidation<DateParts<string>>;
    ignoreHistoryIndicator: InputData<IgnoreHistoryIndicatorType>;
};

export type State = { inputs: InputsState };

const createInitialInputs = (
    findPatientFormState: FindPatientStates
): InputsState => ({
    postcode: {
        value: findPatientFormState.postcode,
        validationErrorReason: "",
    },
    addressEffectiveFrom: {
        value: findPatientFormState.addressEffectiveFrom,
        validationErrorReason: "",
    },
    addressEffectiveTo: {
        value: findPatientFormState.addressEffectiveTo,
        validationErrorReason: "",
    },
    firstname: {
        value: findPatientFormState.firstname,
        validationErrorReason: "",
    },
    surname: {
        value: findPatientFormState.surname,
        validationErrorReason: "",
    },
    dobFrom: {
        value: findPatientFormState.dobFrom,
        validationErrorReason: "",
    },
    dobTo: {
        value: findPatientFormState.dobTo,
        validationErrorReason: "",
    },
    ignoreHistoryIndicator: {
        value: findPatientFormState.ignoreHistoryIndicator || "1",
        validationErrorReason: "",
    },
});

const toQueryArguments = (data: InputsState): PostcodeSearchArguments => {
    const dobRange =
        (
            datePartsItemContainsNonNumberChars(data.dobFrom.value) ||
            datePartsItemContainsNonNumberChars(data.dobTo.value)
        ) ?
            getDateRange()
        :   getDateRange(data.dobFrom.value, data.dobTo.value);

    const addressEffectiveRange =
        (
            datePartsItemContainsNonNumberChars(
                data.addressEffectiveFrom.value
            ) ||
            datePartsItemContainsNonNumberChars(data.addressEffectiveTo.value)
        ) ?
            getDateRange()
        :   getDateRange(
                data.addressEffectiveFrom.value,
                data.addressEffectiveTo.value
            );

    return {
        dobFrom: dobRange.from,
        dobTo: dobRange.to,
        addressEffectiveFrom: addressEffectiveRange.from,
        addressEffectiveTo: addressEffectiveRange.to,
        surname: data.surname.value,
        firstname: data.firstname.value,
        postcode: data.postcode.value,
        ignoreHistoryIndicator: data.ignoreHistoryIndicator.value,
    };
};

const PostcodeSearchForm: React.FC<Props> = () => {
    const dispatch = useAppDispatch();
    const findPatientFormState = useAppSelector(
        (state: any) => state.findPatient
    );
    const internetConnection = useAppSelector(
        (state: any) => state.connection.internetConnection
    );
    const dateInputMethods = useAppSelector(
        (state: any) => state.findPatient.dateInputMethods
    );

    const [inputs, setInputs] = useState<InputsState>(() =>
        createInitialInputs(findPatientFormState)
    );

    const [dobMode, setDobMode] = useState<DateInputMethods>(
        findPatientFormState.dateInputMethods.dob
    );

    useEffect(() => {
        asyncInputFocus(POSTCODE_SEARCH_FORM_POSTCODE_ID);
    }, []);

    useEffect(() => {
        setInputs(createInitialInputs(findPatientFormState));
        setDobMode(findPatientFormState.dateInputMethods.dob);
    }, [findPatientFormState]);

    const saveFormState = useCallback(
        (nextInputs: InputsState, nextDobMode: DateInputMethods) => {
            dispatch(
                updateFormState({
                    dobFrom: nextInputs.dobFrom.value,
                    dobTo: nextInputs.dobTo.value,
                    addressEffectiveFrom: nextInputs.addressEffectiveFrom.value,
                    addressEffectiveTo: nextInputs.addressEffectiveTo.value,
                    surname: nextInputs.surname.value,
                    firstname: nextInputs.firstname.value,
                    postcode: nextInputs.postcode.value,
                    dateInputMethods: {
                        dob: nextDobMode,
                    },
                    ignoreHistoryIndicator:
                        nextInputs.ignoreHistoryIndicator.value,
                })
            );
        },
        [dispatch]
    );

    useEffect(() => {
        return () => {
            saveFormState(inputs, dobMode);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            event.stopPropagation();

            if (!internetConnection) {
                dispatch(createFindPatientConnectionWarningAction());
                return;
            }

            const {
                postcode,
                addressEffectiveFrom,
                addressEffectiveTo,
                firstname,
                surname,
                dobFrom,
                dobTo,
                ignoreHistoryIndicator,
            } = inputs;

            const dobFromLabels: DateInputSwitcherStringMap = {
                singleDate: PATIENT_SEARCH_DOB_LABEL,
                dateRange:
                    PATIENT_SEARCH_DOB_RANGE_LABEL + PATIENT_SEARCH_DATE_FROM,
                ageRange: PATIENT_SEARCH_AGE_RANGE_FROM_LABEL,
            };

            const dobToLabels: DateInputSwitcherStringMap = {
                singleDate: PATIENT_SEARCH_DOB_LABEL,
                dateRange:
                    PATIENT_SEARCH_DOB_RANGE_LABEL + PATIENT_SEARCH_DATE_TO,
                ageRange: PATIENT_SEARCH_AGE_RANGE_TO_LABEL,
            };

            const forbidEmpty = ignoreHistoryIndicator.value === "0";

            const validatedDateRange = validateDateRange(
                {
                    value: addressEffectiveFrom.value,
                    validationErrorReason:
                        addressEffectiveFrom.componentValidationErrorReason,
                },
                {
                    value: addressEffectiveTo.value,
                    validationErrorReason:
                        addressEffectiveTo.componentValidationErrorReason,
                },
                {
                    forbidEmpty,
                    errorMessage:
                        SINGLE_DATE_INPUT_RESPONSES.previous_occupancy_enter_dates,
                }
            );

            const validatedDOBDateRange = validateDOBDateRange(
                {
                    value: dobFrom.value,
                    validationErrorReason:
                        dobFrom.componentValidationErrorReason,
                },
                {
                    value: dobTo.value,
                    validationErrorReason: dobTo.componentValidationErrorReason,
                },
                dobFromLabels[findPatientFormState.dateInputMethods.dob],
                dobToLabels[findPatientFormState.dateInputMethods.dob]
            );

            const nextInputs: InputsState = {
                postcode: validateStringInput("postcode", postcode.value),
                addressEffectiveFrom: validatedDateRange.dateFrom,
                addressEffectiveTo: validatedDateRange.dateTo,
                firstname: validateStringInput("firstname", firstname.value),
                surname: validateStringInput("surname", surname.value),
                dobFrom: validatedDOBDateRange.dateFrom,
                dobTo: validatedDOBDateRange.dateTo,
                ignoreHistoryIndicator,
            };

            const nextIsValid = validateState(nextInputs);

            setInputs(nextInputs);

            if (nextIsValid) {
                saveFormState(nextInputs, dobMode);
                dispatch(runPostcodeQuery(toQueryArguments(nextInputs)));
            }
        },
        [
            inputs,
            findPatientFormState,
            dobMode,
            saveFormState,
            dispatch,
            internetConnection,
        ]
    );

    const handlePostcodeInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setInputs((prev) => ({
                ...prev,
                postcode: {
                    ...prev.postcode,
                    value: formatPostcode(value),
                },
            }));
        },
        []
    );

    const handlePostcodeFinderChange = useCallback(
        (e: OSPlacesLookupResult) => {
            setInputs((prev) => ({
                ...prev,
                postcode: {
                    ...prev.postcode,
                    value: formatPostcode(e.postcode),
                },
            }));
        },
        []
    );

    const handleDateRangeFromChange = useCallback(
        (date: InputData<DateParts<string>>) => {
            setInputs((prev) => ({
                ...prev,
                addressEffectiveFrom: {
                    ...prev.addressEffectiveFrom,
                    value: date.value,
                    componentValidationErrorReason: date.validationErrorReason,
                },
            }));
        },
        []
    );

    const handleDateRangeToChange = useCallback(
        (date: InputData<DateParts<string>>) => {
            setInputs((prev) => ({
                ...prev,
                addressEffectiveTo: {
                    ...prev.addressEffectiveTo,
                    value: date.value,
                    componentValidationErrorReason: date.validationErrorReason,
                },
            }));
        },
        []
    );

    const handleDoBRangeFromChange = useCallback(
        (date: InputData<DateParts<string>>) => {
            setInputs((prev) => ({
                ...prev,
                dobFrom: {
                    ...prev.dobFrom,
                    value: date.value,
                    componentValidationErrorReason: date.validationErrorReason,
                },
            }));
        },
        []
    );

    const handleDoBRangeToChange = useCallback(
        (date: InputData<DateParts<string>>) => {
            setInputs((prev) => ({
                ...prev,
                dobTo: {
                    ...prev.dobTo,
                    value: date.value,
                    componentValidationErrorReason: date.validationErrorReason,
                },
            }));
        },
        []
    );

    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            if (
                name === "firstname" ||
                name === "surname" ||
                name === "postcode"
            ) {
                setInputs((prev) => ({
                    ...prev,
                    [name]: {
                        ...(prev as any)[name],
                        value,
                    },
                }));
            }
        },
        []
    );

    const clearAddressDateRange = useCallback(() => {
        setInputs((prev) => ({
            ...prev,
            addressEffectiveFrom: {
                value: getBlankDate(),
                validationErrorReason: "",
            },
            addressEffectiveTo: {
                value: getBlankDate(),
                validationErrorReason: "",
            },
        }));
    }, []);

    const handleCheckbox = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const value: IgnoreHistoryIndicatorType =
                event.target.checked ? "0" : "1";

            if (value === "1") {
                clearAddressDateRange();
            }

            setInputs((prev) => ({
                ...prev,
                ignoreHistoryIndicator: {
                    value,
                    validationErrorReason:
                        prev.ignoreHistoryIndicator.validationErrorReason,
                },
            }));
        },
        [clearAddressDateRange]
    );

    const buildErrors = useCallback(
        (currentInputs: InputsState): Array<FormErrorSummaryError> => {
            const [dobFromId, dobToId] = getDateInputSwitcherInputIds(
                POSTCODE_SEARCH_FORM_ID,
                "dob",
                findPatientFormState.dateInputMethods["dob"]
            );

            const elementMetadata: Record<keyof InputsState, [string]> = {
                postcode: [POSTCODE_SEARCH_FORM_POSTCODE_ID],
                addressEffectiveFrom: [
                    POSTCODE_SEARCH_FORM_EFFECTIVE_RANGE_ID + "-from",
                ],
                addressEffectiveTo: [
                    POSTCODE_SEARCH_FORM_EFFECTIVE_RANGE_ID + "-to",
                ],
                firstname: [POSTCODE_SEARCH_FORM_FIRST_NAME_ID],
                surname: [POSTCODE_SEARCH_FORM_SURNAME_ID],
                dobFrom: [dobFromId],
                dobTo: [dobToId],
                ignoreHistoryIndicator: [
                    POSTCODE_SEARCH_FORM_INCLUDE_PREVIOUS_OCCUPANTS_ID,
                ],
            };

            return (
                Object.entries(elementMetadata) as Array<
                    [keyof InputsState, [string]]
                >
            ).reduce<Array<FormErrorSummaryError>>(
                (errors, [inputName, [elementId]]) => {
                    const currentInput = currentInputs[inputName];
                    if (currentInput.validationErrorReason) {
                        errors.push({
                            error: `${currentInput.validationErrorReason}`,
                            element: elementId,
                        });
                    }
                    return errors;
                },
                []
            );
        },
        [findPatientFormState.dateInputMethods]
    );

    const defaultChecked = useMemo(
        () => inputs.ignoreHistoryIndicator.value === "0",
        [inputs.ignoreHistoryIndicator.value]
    );

    return (
        <div className="patient-search-form">
            <FormErrorSummary errors={buildErrors(inputs)} />

            <Form
                id={POSTCODE_SEARCH_FORM_ID}
                onSubmit={handleSubmit}
                noValidate
            >
                <h2
                    className="nhsuk-heading-m nhsuk-u-margin-bottom-1 no-outline"
                    tabIndex={-1}
                    id={POSTCODE_SEARCH_LABEL_ID}
                >
                    {POSTCODE_SEARCH_HEADER}
                </h2>

                <HintText id={POSTCODE_SEARCH_HINT_ID}>
                    {POSTCODE_SEARCH_HINT}
                </HintText>

                <div
                    className="patient-search-form__field-group"
                    id={POSTCODE_FORM_GROUP_ID}
                >
                    <TextInput
                        label={POSTCODE_SEARCH_POSTCODE_LABEL}
                        labelProps={{ className: "form-label" }}
                        name="postcode"
                        id={POSTCODE_SEARCH_FORM_POSTCODE_ID}
                        autoComplete="off"
                        width="10"
                        value={inputs.postcode.value}
                        error={inputs.postcode.validationErrorReason}
                        onChange={handlePostcodeInputChange}
                    />

                    <OSPlacesAddressFinder
                        shouldReturnAddressParts={false}
                        onApply={handlePostcodeFinderChange}
                    />
                </div>

                <Checkboxes.Item
                    id={POSTCODE_SEARCH_FORM_INCLUDE_PREVIOUS_OCCUPANTS_ID}
                    defaultChecked={defaultChecked}
                    onChange={handleCheckbox}
                >
                    {POSTCODE_SEARCH_INCLUDE_PREVIOUS_OCCUPANTS}
                </Checkboxes.Item>

                {inputs.ignoreHistoryIndicator.value === "0" && (
                    <div className="nhsuk-checkboxes__conditional">
                        <DateRangeInput
                            insetText={SINGLE_DATE_INPUT_RESPONSES.year_only}
                            id={POSTCODE_SEARCH_FORM_EFFECTIVE_RANGE_ID}
                            label={POSTCODE_SEARCH_EFFECTIVE_RANGE_LABEL}
                            queryName="addressEffective"
                            fromLabel={
                                PATIENT_SEARCH_OCCUPANCY_DATE_RANGE_FROM_LABEL
                            }
                            toLabel={
                                PATIENT_SEARCH_OCCUPANCY_DATE_RANGE_TO_LABEL
                            }
                            dateFrom={getDatePartsAsSingleInputString(
                                inputs.addressEffectiveFrom.value
                            )}
                            dateTo={getDatePartsAsSingleInputString(
                                inputs.addressEffectiveTo.value
                            )}
                            handleDateFromChange={handleDateRangeFromChange}
                            handleDateToChange={handleDateRangeToChange}
                            dateFromError={
                                inputs.addressEffectiveFrom
                                    .validationErrorReason
                            }
                            dateToError={
                                inputs.addressEffectiveTo.validationErrorReason
                            }
                        />
                    </div>
                )}

                <div
                    className="patient-search-form__field-group"
                    id={NAME_FORM_GROUP_ID}
                >
                    <TextInput
                        label={PATIENT_SEARCH_FIRST_NAME_LABEL}
                        labelProps={{ className: "form-label" }}
                        name="firstname"
                        width="20"
                        id={POSTCODE_SEARCH_FORM_FIRST_NAME_ID}
                        autoComplete="off"
                        value={inputs.firstname.value}
                        error={inputs.firstname.validationErrorReason}
                        onChange={handleInputChange}
                    />

                    <TextInput
                        label={PATIENT_SEARCH_SURNAME_LABEL}
                        labelProps={{ className: "form-label" }}
                        name="surname"
                        width="20"
                        id={POSTCODE_SEARCH_FORM_SURNAME_ID}
                        autoComplete="off"
                        value={inputs.surname.value}
                        error={inputs.surname.validationErrorReason}
                        onChange={handleInputChange}
                    />
                </div>

                <DateInputSwitcher
                    formId={POSTCODE_SEARCH_FORM_ID}
                    selectionMethod={dobMode}
                    dateFrom={getDatePartsAsSingleInputString(
                        inputs.dobFrom.value
                    )}
                    dateTo={getDatePartsAsSingleInputString(inputs.dobTo.value)}
                    handleDateFromChange={handleDoBRangeFromChange}
                    handleDateToChange={handleDoBRangeToChange}
                    dateFromError={inputs.dobFrom.validationErrorReason}
                    dateToError={inputs.dobTo.validationErrorReason}
                    handleMethodChange={setDobMode}
                />

                <div className="button-group-section">
                    <Button
                        className="patient-search-form__button"
                        type="submit"
                        id={POSTCODE_SUBMIT_ID}
                    >
                        {POSTCODE_FIND_A_PATIENT}
                    </Button>

                    <p className="search-form-clear-link">
                        <a
                            id={POSTCODE_SEARCH_CLEAR_BUTTON_ID}
                            tabIndex={0}
                            role="button"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(resetFormState());
                            }}
                            onKeyDown={OnEnterPressed((e) => {
                                e.preventDefault();
                                dispatch(resetFormState());
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

export default PostcodeSearchForm;
