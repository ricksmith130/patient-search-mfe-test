import { isExists, isFuture, isValid } from "date-fns";
import Mustache from "mustache";

import { EARLIEST_DOB_INTERVAL } from "ncrs-host/DateConstants";
import {
    REGEX_VALID_CHARACTERS,
    REGEX_VALID_NAME,
} from "ncrs-host/ValidationRegExps";
import {
    CharacterValidator,
    LengthValidator,
    PostcodeValidator,
    SearchGenderValidator,
} from "ncrs-host/CommonValidators";
import {
    allDatePartValuesNaN,
    anyDatePartValuesNaN,
    datePartsItemContainsNonNumberChars,
    isCurrentYear,
    isFutureYear,
} from "ncrs-host/DateHelper";
import {
    datePartsToDateCastIsCoerced,
    datePartsToDateObject,
    datePartsToDatePartValues,
} from "ncrs-host/DateFormatter";
import { DateParts } from "ncrs-host/AppStateTypes";
import { InputData } from "ncrs-host/BasicTypes";
import {
    PATIENT_SEARCH_VALIDATION_DATE_TOO_OLD,
    PATIENT_SEARCH_VALIDATION_DOB_IN_FUTURE,
    PATIENT_SEARCH_VALIDATION_DOB_INVALID,
    PATIENT_SEARCH_VALIDATION_NO_START_WILDCARD,
    PATIENT_SEARCH_VALIDATION_NO_WILDCARDS,
    PATIENT_SEARCH_VALIDATION_REQUIRED,
    PATIENT_SEARCH_VALIDATION_REQUIRED_FOR_WIDEN,
    PATIENT_SEARCH_VALIDATION_REQUIRED_VOWEL,
} from "ncrs-host/FindPatientStrings";

export const validateOptionalPostcode = (
    postcode: string,
    allowWildCards = false
) => {
    let validationIssues: Array<any> = [];
    if (postcode === "")
        return {
            value: postcode,
            validationErrorReason: "",
        };
    if (allowWildCards) {
        if (postcode.includes("*")) {
            validationIssues = validationIssues.concat(
                new LengthValidator({
                    min: 2,
                    max: 8,
                }).validate(postcode.split("*").join(""))
            );
            validationIssues = validationIssues.concat(
                new LengthValidator({
                    min: 2,
                    max: 8,
                }).validate(postcode)
            );
            validationIssues = validationIssues.concat(
                new CharacterValidator(REGEX_VALID_CHARACTERS).validate(
                    postcode.split("*").join("")
                )
            );
        } else {
            {
                validationIssues = validationIssues.concat(
                    new PostcodeValidator().validate(postcode)
                );
            }
        }
    }
    if (validationIssues.length) {
        return {
            value: postcode,
            validationErrorReason: validationIssues[0],
        };
    }

    return validateMandatoryPostcode(postcode, allowWildCards);
};

export const validateMandatoryPostcode = (
    postcode: string,
    allowWildCards = false
) => {
    let validationIssues: Array<any> = [];
    if (postcode === "") {
        validationIssues = validationIssues.concat(
            PATIENT_SEARCH_VALIDATION_REQUIRED_FOR_WIDEN
        );
    }

    if (allowWildCards) {
        if (postcode[0] === "*") {
            validationIssues = validationIssues.concat([
                Mustache.render(PATIENT_SEARCH_VALIDATION_NO_START_WILDCARD, {
                    FieldName: "postcode",
                }),
            ]);
        }
        validationIssues = validationIssues.concat(
            new LengthValidator({
                max: 8,
                min: 2,
            }).validate(postcode.split("*").join(""))
        );
        validationIssues = validationIssues.concat(
            new CharacterValidator(REGEX_VALID_CHARACTERS).validate(
                postcode.split("*").join("")
            )
        );
    } else {
        if (postcode.includes("*")) {
            validationIssues = validationIssues.concat(
                PATIENT_SEARCH_VALIDATION_NO_WILDCARDS
            );
        }
        validationIssues = validationIssues.concat(
            new PostcodeValidator().validate(postcode)
        );
    }

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

export const validateSearchGender = (
    gender: string,
    allowAllGenders = false
): InputData<string> => {
    const validationIssues = new SearchGenderValidator().validate(
        gender,
        allowAllGenders
    );
    if (validationIssues.length) {
        return {
            value: gender,
            validationErrorReason: validationIssues[0],
        };
    }
    return {
        value: gender,
        validationErrorReason: "",
    };
};

export const validateOptionalName = (
    name: string,
    fieldName: string,
    allowWildCards = false,
    label?: string | undefined
): InputData<string> => {
    if (name === "") {
        return {
            value: name,
            validationErrorReason: "",
        };
    }
    const message = patientSearchValidationRequiredMessage(fieldName);

    return validateMandatoryName(
        name,
        message,
        fieldName,
        allowWildCards,
        label
    );
};

export const validateMandatoryName = (
    name: string,
    requiredMessage: string,
    fieldName: string,
    allowWildCards = false,
    label?: string | undefined
): InputData<string> => {
    let validationIssues: Array<any> = [];
    if (name === "") {
        validationIssues = validationIssues.concat([requiredMessage]);
    }
    const lengthValidatorProps: any = { min: 1, max: 35 };
    if (label != null) {
        lengthValidatorProps.field = label;
    }
    if (allowWildCards) {
        if (name[0] === "*" || name[1] === "*") {
            validationIssues = validationIssues.concat([
                Mustache.render(PATIENT_SEARCH_VALIDATION_NO_START_WILDCARD, {
                    FieldName: fieldName,
                }),
            ]);
        }
        validationIssues = validationIssues.concat(
            new LengthValidator(lengthValidatorProps).validate(
                name.split("*").join("")
            )
        );

        validationIssues = validationIssues.concat(
            new LengthValidator(lengthValidatorProps).validate(name)
        );

        validationIssues = validationIssues.concat(
            new CharacterValidator(REGEX_VALID_NAME, label).validate(
                name.split("*").join("")
            )
        );
    } else {
        if (name.includes("*")) {
            validationIssues = validationIssues.concat([
                PATIENT_SEARCH_VALIDATION_NO_WILDCARDS,
            ]);
        }
        validationIssues = validationIssues.concat(
            new LengthValidator(lengthValidatorProps).validate(name)
        );

        validationIssues = validationIssues.concat(
            new CharacterValidator(REGEX_VALID_NAME, label).validate(name)
        );
    }

    if (validationIssues.length) {
        return {
            value: name,
            validationErrorReason: validationIssues[0],
        };
    }

    return {
        value: name,
        validationErrorReason: "",
    };
};

export const validatePartialDate = (
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

    if (isFutureYear(datePartValues.year)) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                PATIENT_SEARCH_VALIDATION_DOB_IN_FUTURE,
                FIELD_NAME
            ),
        };
    }

    const now = new Date();
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
        if (isFuture(date)) {
            return {
                value: dateParts,
                validationErrorReason: Mustache.render(
                    PATIENT_SEARCH_VALIDATION_DOB_IN_FUTURE,
                    FIELD_NAME
                ),
            };
        }
    }

    return {
        value: dateParts,
        validationErrorReason: "",
    };
};

export function patientSearchValidationRequiredMessage(FieldName: string) {
    const message =
        /^[aeiou]/i.test(FieldName) ?
            PATIENT_SEARCH_VALIDATION_REQUIRED_VOWEL
        :   PATIENT_SEARCH_VALIDATION_REQUIRED;
    return Mustache.render(message, { FieldName });
}

export const validateMandatoryDate = (
    dateParts: DateParts<string>,
    fieldName: string
): InputData<DateParts<string>> => {
    const fieldNameObject = {
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
                fieldNameObject
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
    if (anyDatePartValuesNaN(datePartValues)) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                PATIENT_SEARCH_VALIDATION_DOB_INVALID,
                fieldNameObject
            ),
        };
    }
    const date = datePartsToDateObject(dateParts);
    if (!isValid(date)) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                PATIENT_SEARCH_VALIDATION_DOB_INVALID,
                fieldNameObject
            ),
        };
    }
    const now = new Date();
    const differenceInYears = now.getFullYear() - date.getFullYear();
    if (differenceInYears >= EARLIEST_DOB_INTERVAL) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                PATIENT_SEARCH_VALIDATION_DATE_TOO_OLD,
                fieldNameObject
            ),
        };
    }
    if (isFuture(date)) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                PATIENT_SEARCH_VALIDATION_DOB_IN_FUTURE,
                fieldNameObject
            ),
        };
    }
    if (
        !isExists(
            datePartValues.year,
            datePartValues.month - 1, //The month parameter is 0-indexed here so we need to negate 1.
            datePartValues.day
        )
    ) {
        return {
            value: dateParts,
            validationErrorReason: Mustache.render(
                PATIENT_SEARCH_VALIDATION_DOB_INVALID,
                fieldNameObject
            ),
        };
    }
    return {
        value: dateParts,
        validationErrorReason: "",
    };
};
