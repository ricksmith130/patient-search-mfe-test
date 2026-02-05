import {
  Button,
  Checkboxes,
  Fieldset,
  Form,
  HintText,
  InsetText,
  Radios,
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
  type DateInputSwitcherStringMap,
} from "ncrs-host/DateConstants";
import { ADVANCED_SEARCH_LABEL_ID } from "ncrs-host/FormIdConstants";
import {
  ADVANCED_SEARCH_CLEAR_BUTTON_ID,
  ADVANCED_SEARCH_FORM_ALGORITHMIC_ID,
  ADVANCED_SEARCH_FORM_FIRST_NAME_ID,
  ADVANCED_SEARCH_FORM_GENDER_ID,
  ADVANCED_SEARCH_FORM_GENDER_LABEL_ID,
  ADVANCED_SEARCH_FORM_ID,
  ADVANCED_SEARCH_FORM_INCLUDE_DOD_ID,
  ADVANCED_SEARCH_FORM_POSTCODE_ID,
  ADVANCED_SEARCH_FORM_SURNAME_ID,
  GENDER_FORM_GROUP_ID,
  GENDER_SEARCH_ALL_WARNING_ID,
  NAME_FORM_GROUP_ID,
  POSTCODE_FORM_GROUP_ID,
} from "ncrs-host/IdConstants";
import { CLEAR } from "ncrs-host/GenericStrings";
import { GENDER_SEARCH_VALUES } from "ncrs-host/Vocabulary";
import { OnEnterPressed } from "ncrs-host/AccessibilityHelpers";
import { asyncFocus } from "ncrs-host/FocusHelpers";
import { validateState } from "ncrs-host/CommonValidators";
import {
  validateDateRange,
  validateStringInput,
} from "ncrs-host/AdvancedSearchValidator";
import {
  datePartsItemContainsNonNumberChars,
  getDateInputSwitcherInputIds,
  getDateRange,
  isDateBlank,
} from "ncrs-host/DateHelper";
import DateInputSwitcher from "ncrs-host/DateInputSwitcher";
import OSPlacesAddressFinder from "ncrs-host/OSPlacesAddressFinder";
import { getDatePartsAsSingleInputString } from "ncrs-host/DateFormatter";
import { formatPostcode } from "ncrs-host/PostCodeFormatter";
import FormErrorSummary, {
  FormErrorSummaryError,
} from "ncrs-host/FormErrorSummary";
import { createFindPatientConnectionWarningAction } from "ncrs-host/ModalActionCreator";
import { runAdvancedQuery } from "ncrs-host/AdvancedSearchQueryActionCreator";
import {
  resetFormState as resetFormStateAction,
  updateFormState as updateFormStateAction,
} from "ncrs-host/SaveQueryActionCreator";
import { useAppDispatch, useAppSelector } from "ncrs-host/store";
import { getEmptyDateParts } from "ncrs-host/SampleEmptyStates";
import {
  DateParts,
  FindPatientStates,
  OSPlacesLookupResult,
  QueryArguments,
  SearchFormUpdate,
} from "ncrs-host/AppStateTypes";
import {
  InputData,
  InputDataWithComponentValidation,
} from "ncrs-host/BasicTypes";
import {
  PATIENT_SEARCH_DOB_LABEL,
  PATIENT_SEARCH_DOB_RANGE_LABEL,
  PATIENT_SEARCH_DATE_FROM,
  PATIENT_SEARCH_AGE_RANGE_FROM_LABEL,
  PATIENT_SEARCH_DATE_TO,
  PATIENT_SEARCH_AGE_RANGE_TO_LABEL,
  PATIENT_SEARCH_DOD_LABEL,
  PATIENT_SEARCH_DOD_RANGE_LABEL,
  ADVANCED_SEARCH_HEADER,
  ADVANCED_SEARCH_HINT,
  PATIENT_SEARCH_GENDER_LABEL,
  PATIENT_SEARCH_GENDER_FEMALE_LABEL,
  PATIENT_SEARCH_GENDER_MALE_LABEL,
  PATIENT_SEARCH_GENDER_SEARCH_ALL_LABEL,
  PATIENT_SEARCH_GENDER_SEARCH_ALL_CONDITIONAL_TEXT,
  PATIENT_SEARCH_FIRST_NAME_LABEL,
  PATIENT_SEARCH_SURNAME_LABEL,
  PATIENT_SEARCH_WIDEN_LABEL,
  PATIENT_SEARCH_POSTCODE_LABEL,
  PATIENT_SEARCH_INCLUDE_DOD_LABEL,
  ADVANCED_SEARCH_FIND_A_PATIENT,
} from "../constants/FindPatientStrings";

export type Props = {
  findPatientFormState?: FindPatientStates;
  runAdvancedQuery?: (q: QueryArguments) => {};
  internetConnection?: boolean;
  showNoConnectionModal?: () => {};
  updateFormState?: (state: SearchFormUpdate) => {};
  resetFormState?: () => {};
};

export type InputsState = {
  gender: InputData<string>;
  firstname: InputData<string>;
  surname: InputData<string>;
  dobFrom: InputDataWithComponentValidation<DateParts<string>>;
  dobTo: InputDataWithComponentValidation<DateParts<string>>;
  dodFrom: InputDataWithComponentValidation<DateParts<string>>;
  dodTo: InputDataWithComponentValidation<DateParts<string>>;
  postcode: InputData<string>;
  algorithmicSearch: InputData<boolean>;
  includeDod: InputData<boolean>;
};

export type State = { inputs: InputsState };

const createInitialInputs = (
  findPatientFormState: FindPatientStates,
): InputsState => ({
  gender: { value: findPatientFormState.gender, validationErrorReason: "" },
  firstname: {
    value: findPatientFormState.firstname,
    validationErrorReason: "",
  },
  surname: { value: findPatientFormState.surname, validationErrorReason: "" },
  dobFrom: { value: findPatientFormState.dobFrom, validationErrorReason: "" },
  dobTo: { value: findPatientFormState.dobTo, validationErrorReason: "" },
  dodFrom: { value: findPatientFormState.dodFrom, validationErrorReason: "" },
  dodTo: { value: findPatientFormState.dodTo, validationErrorReason: "" },
  postcode: {
    value: findPatientFormState.postcode,
    validationErrorReason: "",
  },
  algorithmicSearch: {
    value: findPatientFormState.algorithmicSearch,
    validationErrorReason: "",
  },
  includeDod: {
    value:
      findPatientFormState.includeDod ||
      !isDateBlank(findPatientFormState.dodFrom) ||
      !isDateBlank(findPatientFormState.dodTo),
    validationErrorReason: "",
  },
});

const toQueryArguments = (data: InputsState): QueryArguments => {
  const dobRange =
    datePartsItemContainsNonNumberChars(data.dobFrom.value) ||
    datePartsItemContainsNonNumberChars(data.dobTo.value)
      ? getDateRange()
      : getDateRange(data.dobFrom.value, data.dobTo.value);

  const invalidDod =
    !data.includeDod.value ||
    datePartsItemContainsNonNumberChars(data.dodFrom.value) ||
    datePartsItemContainsNonNumberChars(data.dodTo.value);

  const dodRange = invalidDod
    ? getDateRange()
    : getDateRange(data.dodFrom.value, data.dodTo.value);

  return {
    dobFrom: dobRange.from,
    dobTo: dobRange.to,
    gender: data.gender.value,
    surname: data.surname.value,
    algorithmicSearch:
      JSON.parse(String(data.algorithmicSearch.value)) === true,
    firstname: data.firstname.value,
    postcode: data.postcode.value,
    dateOfDeathFrom: dodRange.from,
    dateOfDeathTo: dodRange.to,
  };
};

const AdvancedSearchForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  const findPatientFormStateFromState = useAppSelector(
    (state: any) => state.findPatient,
  );
  const internetConnectionFromState = useAppSelector(
    (state: any) => state.connection.internetConnection,
  );

  const findPatientFormState =
    props.findPatientFormState ?? findPatientFormStateFromState;
  const internetConnection =
    props.internetConnection ?? internetConnectionFromState;

  const runAdvancedQueryAction =
    props.runAdvancedQuery ??
    ((q: QueryArguments) => dispatch(runAdvancedQuery(q)));
  const updateFormState =
    props.updateFormState ??
    ((state: SearchFormUpdate) => dispatch(updateFormStateAction(state)));
  const resetFormState =
    props.resetFormState ?? (() => dispatch(resetFormStateAction()));
  const showNoConnectionModal =
    props.showNoConnectionModal ??
    (() => dispatch(createFindPatientConnectionWarningAction()));

  const [inputs, setInputs] = useState<InputsState>(() =>
    createInitialInputs(findPatientFormState),
  );
  const [dobMode, setDobMode] = useState<DateInputMethods>(
    findPatientFormState.dateInputMethods.dob,
  );
  const [dodMode, setDodMode] = useState<DateInputMethods>(
    findPatientFormState.dateInputMethods.dod,
  );

  useEffect(() => {
    asyncFocus(ADVANCED_SEARCH_FORM_ID);
  }, []);

  useEffect(() => {
    setInputs(createInitialInputs(findPatientFormState));
    setDobMode(findPatientFormState.dateInputMethods.dob);
    setDodMode(findPatientFormState.dateInputMethods.dod);
  }, [findPatientFormState]);

  const saveFormState = useCallback(
    (
      nextInputs: InputsState,
      nextDobMode: DateInputMethods,
      nextDodMode: DateInputMethods,
    ) => {
      updateFormState({
        dobTo: nextInputs.dobTo.value,
        dobFrom: nextInputs.dobFrom.value,
        gender: nextInputs.gender.value,
        surname: nextInputs.surname.value,
        firstname: nextInputs.firstname.value,
        postcode: nextInputs.postcode.value,
        dodFrom: nextInputs.dodFrom.value,
        dodTo: nextInputs.dodTo.value,
        algorithmicSearch: nextInputs.algorithmicSearch.value,
        includeDod: nextInputs.includeDod.value,
        dateInputMethods: {
          dod: nextDodMode,
          dob: nextDobMode,
        },
      });
    },
    [updateFormState],
  );

  useEffect(() => {
    return () => {
      saveFormState(inputs, dobMode, dodMode);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!internetConnection) {
        showNoConnectionModal();
        return;
      }

      const dateInputMethods = findPatientFormState.dateInputMethods;

      const {
        dobFrom,
        dobTo,
        algorithmicSearch,
        firstname,
        surname,
        gender,
        postcode,
        includeDod,
        dodFrom,
        dodTo,
      } = inputs;

      const dobFromLabels: DateInputSwitcherStringMap = {
        singleDate: PATIENT_SEARCH_DOB_LABEL,
        dateRange: PATIENT_SEARCH_DOB_RANGE_LABEL + PATIENT_SEARCH_DATE_FROM,
        ageRange: PATIENT_SEARCH_AGE_RANGE_FROM_LABEL,
      };
      const dobToLabels: DateInputSwitcherStringMap = {
        singleDate: PATIENT_SEARCH_DOB_LABEL,
        dateRange: PATIENT_SEARCH_DOB_RANGE_LABEL + PATIENT_SEARCH_DATE_TO,
        ageRange: PATIENT_SEARCH_AGE_RANGE_TO_LABEL,
      };

      const validatedDateOfBirthRange = validateDateRange(
        {
          value: dobFrom.value,
          validationErrorReason: dobFrom.componentValidationErrorReason,
        },
        {
          value: dobTo.value,
          validationErrorReason: dobTo.componentValidationErrorReason,
        },
        dobFromLabels[dateInputMethods.dob],
        dobToLabels[dateInputMethods.dob],
      );

      const dobFromValidity = validatedDateOfBirthRange.dateFrom;
      const dobToValidity = validatedDateOfBirthRange.dateTo;

      let dodFromValidity = dodFrom;
      let dodToValidity = dodTo;

      if (includeDod.value) {
        const dodFromLabels: DateInputSwitcherStringMap = {
          singleDate: PATIENT_SEARCH_DOD_LABEL,
          dateRange: PATIENT_SEARCH_DOD_RANGE_LABEL + PATIENT_SEARCH_DATE_FROM,
          ageRange: "SHOULDN'T EXIST",
        };
        const dodToLabels: DateInputSwitcherStringMap = {
          singleDate: PATIENT_SEARCH_DOD_LABEL,
          dateRange: PATIENT_SEARCH_DOD_RANGE_LABEL + PATIENT_SEARCH_DATE_TO,
          ageRange: "SHOULDN'T EXIST",
        };

        const validatedDateOfDeathRange = validateDateRange(
          {
            value: dodFrom.value,
            validationErrorReason: dobFrom.componentValidationErrorReason,
          },
          {
            value: dodTo.value,
            validationErrorReason: dobTo.componentValidationErrorReason,
          },
          dodFromLabels[dateInputMethods.dod],
          dodToLabels[dateInputMethods.dod],
        );
        dodFromValidity = validatedDateOfDeathRange.dateFrom;
        dodToValidity = validatedDateOfDeathRange.dateTo;
      }

      if (
        !includeDod.value &&
        isDateBlank(dodFrom.value) &&
        isDateBlank(dodTo.value)
      ) {
        dodFromValidity = {
          value: getEmptyDateParts(),
          validationErrorReason: "",
        };
      }

      const nextInputs: InputsState = {
        algorithmicSearch: {
          value: algorithmicSearch.value,
          validationErrorReason: "",
        },
        includeDod: {
          value: includeDod.value,
          validationErrorReason: "",
        },
        firstname: validateStringInput(
          "firstname",
          firstname.value,
          algorithmicSearch.value,
          firstname.value == "" ? true : false,
          postcode.value == "" ? true : false,
        ),
        surname: validateStringInput(
          "surname",
          surname.value,
          algorithmicSearch.value,
          firstname.value == "" ? true : false,
          postcode.value == "" ? true : false,
        ),
        gender: validateStringInput(
          "gender",
          gender.value,
          algorithmicSearch.value,
          firstname.value == "" ? true : false,
          postcode.value == "" ? true : false,
        ),
        postcode: validateStringInput(
          "postcode",
          postcode.value,
          algorithmicSearch.value,
          firstname.value == "" ? true : false,
          postcode.value == "" ? true : false,
        ),
        dobFrom: dobFromValidity,
        dobTo: dobToValidity,
        dodFrom: dodFromValidity,
        dodTo: dodToValidity,
      };

      const nextIsValid = validateState(nextInputs);

      setInputs(nextInputs);

      if (nextIsValid) {
        saveFormState(nextInputs, dobMode, dodMode);
        runAdvancedQueryAction(toQueryArguments(nextInputs));
      }
    },
    [
      inputs,
      internetConnection,
      showNoConnectionModal,
      findPatientFormState,
      dobMode,
      dodMode,
      saveFormState,
      runAdvancedQueryAction,
    ],
  );

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "firstname" || name === "surname" || name === "postcode") {
      setInputs((prev) => ({
        ...prev,
        [name]: {
          ...(prev as any)[name],
          value,
        },
      }));
    }
  }, []);

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
    [],
  );

  const handlePostcodeFinderChange = useCallback((e: OSPlacesLookupResult) => {
    setInputs((prev) => ({
      ...prev,
      postcode: {
        ...prev.postcode,
        value: formatPostcode(e.postcode),
      },
    }));
  }, []);

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
    [],
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
    [],
  );

  const handleDoDRangeFromChange = useCallback(
    (date: InputData<DateParts<string>>) => {
      setInputs((prev) => ({
        ...prev,
        dodFrom: {
          ...prev.dodFrom,
          value: date.value,
          componentValidationErrorReason: date.validationErrorReason,
        },
      }));
    },
    [],
  );

  const handleDoDRangeToChange = useCallback(
    (date: InputData<DateParts<string>>) => {
      setInputs((prev) => ({
        ...prev,
        dodTo: {
          ...prev.dodTo,
          value: date.value,
          componentValidationErrorReason: date.validationErrorReason,
        },
      }));
    },
    [],
  );

  const handleGenderChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const { value } = e.target;
    setInputs((prev) => ({
      ...prev,
      gender: { ...prev.gender, value },
    }));
  }, []);

  const handleAlgorithmicSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      setInputs((prev) => ({
        ...prev,
        algorithmicSearch: {
          ...prev.algorithmicSearch,
          value: checked,
        },
      }));
    },
    [],
  );

  const handleIncludeDodChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      setInputs((prev) => ({
        ...prev,
        includeDod: { ...prev.includeDod, value: checked },
      }));
    },
    [],
  );

  const buildErrors = useCallback(
    (currentInputs: InputsState): Array<FormErrorSummaryError> => {
      const [dobFromId, dobToId] = getDateInputSwitcherInputIds(
        ADVANCED_SEARCH_FORM_ID,
        "dob",
        findPatientFormState.dateInputMethods.dob,
      );
      const [dodFromId, dodToId] = getDateInputSwitcherInputIds(
        ADVANCED_SEARCH_FORM_ID,
        "dod",
        findPatientFormState.dateInputMethods.dod,
      );

      const elementMetadata: Record<keyof InputsState, [string]> = {
        gender: [ADVANCED_SEARCH_FORM_GENDER_ID],
        firstname: [ADVANCED_SEARCH_FORM_FIRST_NAME_ID],
        surname: [ADVANCED_SEARCH_FORM_SURNAME_ID],
        algorithmicSearch: [`${ADVANCED_SEARCH_FORM_ALGORITHMIC_ID}-1`],
        dobFrom: [dobFromId],
        dobTo: [dobToId],
        postcode: [ADVANCED_SEARCH_FORM_POSTCODE_ID],
        includeDod: [`${ADVANCED_SEARCH_FORM_INCLUDE_DOD_ID}-l`],
        dodFrom: [dodFromId],
        dodTo: [dodToId],
      };

      return (
        Object.entries(elementMetadata) as Array<[keyof InputsState, [string]]>
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
        [],
      );
    },
    [findPatientFormState.dateInputMethods],
  );

  const showSearchAllWarning = useMemo(
    () => inputs.gender.value === GENDER_SEARCH_VALUES.search_all,
    [inputs.gender.value],
  );

  return (
    <div className="patient-search-form">
      <FormErrorSummary errors={buildErrors(inputs)} />
      <Form id={ADVANCED_SEARCH_FORM_ID} onSubmit={handleSubmit} noValidate>
        <h2
          className="nhsuk-heading-m nhsuk-u-margin-bottom-1 no-outline"
          id={ADVANCED_SEARCH_LABEL_ID}
          tabIndex={-1}
        >
          {ADVANCED_SEARCH_HEADER}
        </h2>

        <HintText>{ADVANCED_SEARCH_HINT}</HintText>

        <Fieldset id={GENDER_FORM_GROUP_ID}>
          <Fieldset.Legend
            id={ADVANCED_SEARCH_FORM_GENDER_LABEL_ID}
            className="form-label"
          >
            {PATIENT_SEARCH_GENDER_LABEL}
          </Fieldset.Legend>

          <Radios
            onChange={handleGenderChange}
            name="gender"
            id={ADVANCED_SEARCH_FORM_GENDER_ID}
            inline
            error={inputs.gender.validationErrorReason}
          >
            <Radios.Item
              value={GENDER_SEARCH_VALUES.female}
              checked={inputs.gender.value === GENDER_SEARCH_VALUES.female}
            >
              {PATIENT_SEARCH_GENDER_FEMALE_LABEL}
            </Radios.Item>
            <Radios.Item
              value={GENDER_SEARCH_VALUES.male}
              checked={inputs.gender.value === GENDER_SEARCH_VALUES.male}
            >
              {PATIENT_SEARCH_GENDER_MALE_LABEL}
            </Radios.Item>
            <Radios.Item
              value={GENDER_SEARCH_VALUES.search_all}
              checked={inputs.gender.value === GENDER_SEARCH_VALUES.search_all}
            >
              {PATIENT_SEARCH_GENDER_SEARCH_ALL_LABEL}
            </Radios.Item>
          </Radios>
        </Fieldset>

        {showSearchAllWarning ? (
          <InsetText id={GENDER_SEARCH_ALL_WARNING_ID}>
            {PATIENT_SEARCH_GENDER_SEARCH_ALL_CONDITIONAL_TEXT}
          </InsetText>
        ) : null}

        <div
          className="patient-search-form__field-group"
          id={NAME_FORM_GROUP_ID}
        >
          <TextInput
            label={PATIENT_SEARCH_FIRST_NAME_LABEL}
            labelProps={{ className: "form-label" }}
            name="firstname"
            width="20"
            id={ADVANCED_SEARCH_FORM_FIRST_NAME_ID}
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
            id={ADVANCED_SEARCH_FORM_SURNAME_ID}
            autoComplete="off"
            value={inputs.surname.value}
            error={inputs.surname.validationErrorReason}
            onChange={handleInputChange}
          />

          <Checkboxes
            name="algorithmicSearch"
            id={ADVANCED_SEARCH_FORM_ALGORITHMIC_ID}
            onChange={handleAlgorithmicSearchChange}
          >
            <Checkboxes.Item
              value="true"
              checked={inputs.algorithmicSearch.value}
            >
              {PATIENT_SEARCH_WIDEN_LABEL}
            </Checkboxes.Item>
          </Checkboxes>
        </div>

        <DateInputSwitcher
          formId={ADVANCED_SEARCH_FORM_ID}
          selectionMethod={dobMode}
          dateFrom={getDatePartsAsSingleInputString(inputs.dobFrom.value)}
          dateTo={getDatePartsAsSingleInputString(inputs.dobTo.value)}
          handleDateFromChange={handleDoBRangeFromChange}
          handleDateToChange={handleDoBRangeToChange}
          dateFromError={inputs.dobFrom.validationErrorReason}
          dateToError={inputs.dobTo.validationErrorReason}
          handleMethodChange={setDobMode}
        />

        <div
          className="patient-search-form__field-group"
          id={POSTCODE_FORM_GROUP_ID}
        >
          <TextInput
            label={PATIENT_SEARCH_POSTCODE_LABEL}
            name="postcode"
            id={ADVANCED_SEARCH_FORM_POSTCODE_ID}
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
          id={ADVANCED_SEARCH_FORM_INCLUDE_DOD_ID}
          name="includeDateOfDeath"
          value="true"
          checked={inputs.includeDod.value}
          onChange={handleIncludeDodChange}
        >
          {PATIENT_SEARCH_INCLUDE_DOD_LABEL}
        </Checkboxes.Item>

        {inputs.includeDod.value && (
          <div className="nhsuk-checkboxes__conditional">
            <DateInputSwitcher
              formId={ADVANCED_SEARCH_FORM_ID}
              fieldType="dod"
              fieldLabel={PATIENT_SEARCH_DOD_LABEL}
              queryName="dateOfDeath"
              selectionMethod={dodMode}
              dateFrom={getDatePartsAsSingleInputString(inputs.dodFrom.value)}
              dateTo={getDatePartsAsSingleInputString(inputs.dodTo.value)}
              handleDateFromChange={handleDoDRangeFromChange}
              handleDateToChange={handleDoDRangeToChange}
              dateFromError={inputs.dodFrom.validationErrorReason}
              dateToError={inputs.dodTo.validationErrorReason}
              handleMethodChange={setDodMode}
            />
          </div>
        )}

        <div className="button-group-section">
          <Button className="patient-search-form__button" type="submit">
            {ADVANCED_SEARCH_FIND_A_PATIENT}
          </Button>
          <p className="search-form-clear-link">
            <a
              id={ADVANCED_SEARCH_CLEAR_BUTTON_ID}
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

export default AdvancedSearchForm;
