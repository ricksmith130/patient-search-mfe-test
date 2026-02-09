import { isAfter, isValid } from "date-fns";
import Mustache from "mustache";

import { REGEX_VALID_POST_CODE } from "ncrs-host/ValidationRegExps";
import {
    CharacterValidator,
    isValidPostcode,
} from "ncrs-host/CommonValidators";
import {
    patientSearchValidationRequiredMessage,
    validateOptionalName,
    validatePartialDate,
} from "./PatientSearchValidationRules";
import {
    allDatePartValuesNaN,
    datePartsItemContainsNonNumberChars,
    isCurrentYear,
    isDateBlank,
} from "ncrs-host/DateHelper";
import { fixSmartQuotes } from "ncrs-host/GenericHelpers";
import {
    datePartsToDateCastIsCoerced,
    datePartsToDateObject,
    datePartsToDatePartValues,
    getBlankDate,
    partialDatePartsToDateObject,
} from "ncrs-host/DateFormatter";
import { State } from "../components/PostcodeSearchForm";
import { DateParts } from "ncrs-host/AppStateTypes";
import { InputData } from "ncrs-host/BasicTypes";
import {
    INVALID_DATE_RANGE,
    INVALID_EFFECTIVE_DATE_RANGE,
    PATIENT_SEARCH_FIRST_NAME_LABEL,
    PATIENT_SEARCH_SURNAME_LABEL,
    PATIENT_SEARCH_VALIDATION_DATE_TOO_OLD,
    PATIENT_SEARCH_VALIDATION_DOB_IN_FUTURE,
    PATIENT_SEARCH_VALIDATION_DOB_INVALID,
    PATIENT_SEARCH_VALIDATION_EFFECTIVE_DATE_TOO_OLD,
} from "ncrs-host/FindPatientStrings";
import {
    VALIDATION_INVALID_FORMAT,
    VALIDATION_INVALID_POSTCODE_LENGTH,
} from "ncrs-host/ValidationMessageStrings";

export const validateStringInput = (
    fieldName: keyof State["inputs"],
    data: string
): InputData<string> => {
    // Fix iPad's "smart" quotes
    data = fixSmartQuotes(data);

    switch (fieldName) {
        case "postcode":
            return validatePostcode(data);
        case "firstname":
            return validateOptionalName(
                data,
                "First name",
                true,
                PATIENT_SEARCH_FIRST_NAME_LABEL
            );
        case "surname":
            return validateOptionalName(
                data,
                "Last name",
                true,
                PATIENT_SEARCH_SURNAME_LABEL
            );
    }

    return {
        value: data,
        validationErrorReason: "",
    };
};

const validatePostcode = (postcode: string) => {
    let validationIssues: Array<any> = [];
    validationIssues = validationIssues.concat(
        new PostcodeValidator().validate(postcode)
    );
    if (validationIssues.length) {
        return {
            value: postcode.toUpperCase(),
            validationErrorReason: validationIssues[0],
        };
    }
    return {
        value: postcode,
        validationErrorReason: "",
    };
};

export const validateDateRange = (
    fromDate: InputData<DateParts<string>>,
    toDate: InputData<DateParts<string>>,
    forbidEmpty?: {
        forbidEmpty: boolean;
        errorMessage: string;
    }
) => {
    if (
        forbidEmpty?.forbidEmpty === true &&
        isDateBlank(fromDate.value) &&
        isDateBlank(toDate.value)
    ) {
        return {
            dateFrom: {
                value: getBlankDate(),
                validationErrorReason: forbidEmpty.errorMessage,
            },
            dateTo: {
                value: getBlankDate(),
                // space here so that both boxes are highlighted red
                validationErrorReason: " ",
            },
        };
    }

    if (isDateBlank(fromDate.value) && isDateBlank(toDate.value)) {
        return { dateFrom: fromDate, dateTo: toDate };
    }

    const validation = {
        dateFrom:
            fromDate.validationErrorReason ? fromDate
            : !isDateBlank(fromDate.value) ?
                validatePartialDate(fromDate.value, "Effective from")
            :   {
                    value: fromDate.value,
                    validationErrorReason: "Enter an Effective from date",
                },
        dateTo:
            toDate.validationErrorReason ? toDate
            : !isDateBlank(toDate.value) ?
                validateEffectiveToPartialDate(toDate.value, "Effective to")
            :   {
                    value: toDate.value,
                    validationErrorReason: "Enter an Effective to date",
                },
    };
    if (
        validation.dateFrom.validationErrorReason ||
        validation.dateTo.validationErrorReason
    ) {
        return validation;
    }
    const from = partialDatePartsToDateObject(fromDate.value, "from");
    const to = partialDatePartsToDateObject(toDate.value, "to");
    if (isAfter(from, to)) {
        validation.dateTo.validationErrorReason = INVALID_EFFECTIVE_DATE_RANGE;
    }
    return validation;
};

export const validateDOBDateRange = (
    fromDate: InputData<DateParts<string>>,
    toDate: InputData<DateParts<string>>,
    fromLabel: string,
    toLabel: string
) => {
    const validation = {
        dateFrom:
            fromDate.validationErrorReason ? fromDate
            : !isDateBlank(toDate.value) ?
                validatePartialDate(fromDate.value, fromLabel)
            :   { value: fromDate.value, validationErrorReason: "" },
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

class PostcodeValidator {
    validate = (
        value: string,
        lengthError?: string,
        formatError?: string,
        characterError?: string
    ): Array<string> => {
        if (isValidPostcode(value)) {
            return [];
        } else {
            const errors = new CharacterValidator(
                REGEX_VALID_POST_CODE
            ).validate(value);

            if (value.length === 0) {
                return [lengthError || "Enter a postcode"];
            } else if (!value || value.replace(/\s/g, "").length < 5) {
                return [lengthError || VALIDATION_INVALID_POSTCODE_LENGTH];
            } else if (errors.length > 0) {
                return [characterError || VALIDATION_INVALID_FORMAT];
            }

            return [formatError || VALIDATION_INVALID_FORMAT];
        }
    };
}

const validateEffectiveToPartialDate = (
    dateParts: DateParts<string>,
    fieldName: string
): InputData<DateParts<string>> => {
    const FIELD_NAME = {
        FieldName: fieldName,
    };
    if (!dateParts) {
        return {
            value: dateParts,
            validationErrorReason:
                patientSearchValidationRequiredMessage(fieldName),
        };
    }

    if (datePartsItemContainsNonNumberChars(dateParts)) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                PATIENT_SEARCH_VALIDATION_DOB_INVALID,
                FIELD_NAME
            ),
        };
    }

    const datePartValues: DateParts<number> =
        datePartsToDatePartValues(dateParts);

    if (allDatePartValuesNaN(datePartValues)) {
        return {
            value: dateParts,
            validationErrorReason:
                patientSearchValidationRequiredMessage(fieldName),
        };
    }
    if (Number.isNaN(datePartValues.year)) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                PATIENT_SEARCH_VALIDATION_DOB_INVALID,
                FIELD_NAME
            ),
        };
    }

    const now = new Date();
    const futureYear = now.getFullYear() + 150;
    if (datePartValues.year > futureYear) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                PATIENT_SEARCH_VALIDATION_EFFECTIVE_DATE_TOO_OLD,
                FIELD_NAME
            ),
        };
    }

    const currentYear = now.getFullYear();
    const differenceInYears = currentYear - datePartValues.year;
    if (differenceInYears > 150) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                PATIENT_SEARCH_VALIDATION_DATE_TOO_OLD,
                FIELD_NAME
            ),
        };
    }

    if (Number.isInteger(datePartValues.month)) {
        const monthIsValid =
            datePartValues.month > 0 && datePartValues.month <= 12;
        if (!monthIsValid) {
            return {
                value: dateParts,
                validationErrorReason: Mustache.render(
                    PATIENT_SEARCH_VALIDATION_DOB_INVALID,
                    FIELD_NAME
                ),
            };
        }

        if (isCurrentYear(datePartValues.year)) {
            const currentMonth = now.getMonth() + 1;
            if (datePartValues.month > currentMonth)
                return {
                    value: dateParts,
                    validationErrorReason: Mustache.render(
                        PATIENT_SEARCH_VALIDATION_DOB_IN_FUTURE,
                        FIELD_NAME
                    ),
                };
        }
    }

    if (
        Number.isInteger(datePartValues.day) &&
        Number.isInteger(datePartValues.month) &&
        Number.isInteger(datePartValues.year)
    ) {
        const date = datePartsToDateObject(dateParts);
        if (datePartsToDateCastIsCoerced(dateParts)) {
            return {
                value: dateParts,
                validationErrorReason: Mustache.render(
                    PATIENT_SEARCH_VALIDATION_DOB_INVALID,
                    FIELD_NAME
                ),
            };
        }
        if (!isValid(date)) {
            return {
                value: dateParts,
                validationErrorReason: Mustache.render(
                    PATIENT_SEARCH_VALIDATION_DOB_INVALID,
                    FIELD_NAME
                ),
            };
        }
        if (date.getFullYear() > date.getFullYear() + 150) {
            return {
                value: dateParts,
                validationErrorReason: Mustache.render(
                    PATIENT_SEARCH_VALIDATION_DOB_IN_FUTURE,
                    FIELD_NAME
                ),
            };
        }
    }

    if (!Number.isInteger(datePartValues.year)) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                "{{{FieldName}}} date must include a year",
                FIELD_NAME
            ),
        };
    }

    return {
        value: dateParts,
        validationErrorReason: "",
    };
};
