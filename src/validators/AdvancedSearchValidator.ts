import { isAfter } from "date-fns";

import {
    validateMandatoryName,
    validateMandatoryPostcode,
    validateOptionalName,
    validateOptionalPostcode,
    validatePartialDate,
    validateSearchGender,
} from "./PatientSearchValidationRules";
import { isDateBlank } from "ncrs-host/DateHelper";
import { fixSmartQuotes } from "ncrs-host/GenericHelpers";
import { partialDatePartsToDateObject } from "ncrs-host/DateFormatter";
import { State } from "../components/AdvancedSearchForm";
import { DateParts } from "ncrs-host/AppStateTypes";
import { InputData } from "ncrs-host/BasicTypes";
import {
    INVALID_DATE_RANGE,
    PATIENT_SEARCH_FIRST_NAME_LABEL,
    PATIENT_SEARCH_SURNAME_LABEL,
    PATIENT_SEARCH_VALIDATION_REQUIRED_FOR_LAST_NAME,
    PATIENT_SEARCH_VALIDATION_REQUIRED_FOR_WIDEN,
} from "../constants/FindPatientStrings";

export const validateStringInput = (
    fieldName: keyof State["inputs"],
    data: string,
    algorithmicSearchValidation = false,
    isFirstNameEmpty = true,
    isPostcodeEmpty = true
): InputData<string> => {
    // Fix iPad's "smart" quotes
    data = fixSmartQuotes(data);

    switch (fieldName) {
        case "gender":
            return validateSearchGender(data, true);
        case "surname":
            // eslint-disable-next-line no-case-declarations
            let allowWildCards = true;
            if (algorithmicSearchValidation) {
                allowWildCards = false;
            }
            return validateMandatoryName(
                data,
                PATIENT_SEARCH_VALIDATION_REQUIRED_FOR_LAST_NAME,
                "last name",
                allowWildCards,
                PATIENT_SEARCH_SURNAME_LABEL
            );
        // Optionals
        case "firstname":
            if (algorithmicSearchValidation && isPostcodeEmpty) {
                return validateMandatoryName(
                    data,
                    PATIENT_SEARCH_VALIDATION_REQUIRED_FOR_WIDEN,
                    "first name",
                    false,
                    PATIENT_SEARCH_FIRST_NAME_LABEL
                );
            }
            return validateOptionalName(
                data,
                "first name",
                true,
                PATIENT_SEARCH_FIRST_NAME_LABEL
            );
        case "postcode":
            if (algorithmicSearchValidation && isFirstNameEmpty) {
                return validateMandatoryPostcode(data, false);
            }
            return validateOptionalPostcode(data, true);
    }
    return {
        value: data,
        validationErrorReason: "",
    };
};

export const validateDateRange = (
    fromDate: InputData<DateParts<string>>,
    toDate: InputData<DateParts<string>>,
    fromLabel: string,
    toLabel: string
) => {
    const validation = {
        dateFrom:
            fromDate.validationErrorReason ? fromDate : (
                validatePartialDate(fromDate.value, fromLabel)
            ),
        dateTo:
            toDate.validationErrorReason ? toDate
            : !isDateBlank(toDate.value) ?
                validatePartialDate(toDate.value, toLabel)
            :   { value: toDate.value, validationErrorReason: "" },
    };
    if (
        (validation.dateFrom.validationErrorReason &&
            validation.dateFrom.validationErrorReason.length) ||
        (validation.dateTo.validationErrorReason &&
            validation.dateTo.validationErrorReason.length)
    ) {
        return validation;
    }
    const from = partialDatePartsToDateObject(fromDate.value, "from");
    const to = partialDatePartsToDateObject(toDate.value, "to");
    if (!isDateBlank(toDate.value) && isAfter(from, to)) {
        validation.dateTo.validationErrorReason = INVALID_DATE_RANGE;
    }
    return validation;
};
