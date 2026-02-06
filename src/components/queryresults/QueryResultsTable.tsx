import classNames from "classnames";
import Mustache from "mustache";
import {
    Checkboxes,
    Fieldset,
    Form,
    Radios,
    TextInput,
} from "nhsuk-react-components";
import React, { useEffect, useState } from "react";

// @ts-ignore - Federated module
import {
    RESULTS_DECEASED_SORT_ID,
    RESULTS_FILTER_CHECKBOXES,
    RESULTS_FILTER_CHECKBOXES_LABEL_ID,
    RESULTS_FILTER_CLEAR_ID,
    RESULTS_FILTER_GENDER_ID,
    RESULTS_FILTER_GENDER_LABEL_ID,
    RESULTS_FILTER_SEARCH_ID,
    RESULTS_FILTER_SEARCH_LABEL_ID,
    RESULTS_LAST_NAME_FIRST_ID,
} from "ncrs-host/IdConstants";
// @ts-ignore - Federated module
import {
    SORT_ASC,
    SORT_CLEAR,
    SORT_DESC,
} from "ncrs-host/BirthNotificationResultsStrings";
// @ts-ignore - Federated module
import {
    NOT_APPLICABLE,
    NOT_AVAILABLE,
    NOT_KNOWN,
    NOT_RECORDED,
} from "ncrs-host/CommonStrings";
// @ts-ignore - Federated module
import { RESET } from "ncrs-host/GenericStrings";
// @ts-ignore - Federated module
import {
    GP_PRACTICE_CODE_NOT_APPLICABLE,
    GP_PRACTICE_CODE_NOT_KNOWN,
    NO_PRIMARY_CARE_PROVIDER_CODE,
} from "ncrs-host/SpineVocabulary";
// @ts-ignore - Federated module
import { OnEnterPressed } from "ncrs-host/AccessibilityHelpers";
// @ts-ignore - Federated module
import { isEmpty } from "ncrs-host/GenericHelpers";
// @ts-ignore - Federated module
import { evaluateAlphabeticalItems } from "ncrs-host/QueryResultsHelper";
// @ts-ignore - Federated module
import {
    SmallCheckboxes,
    SmallRadios,
} from "ncrs-host/SmallComponents";
// @ts-ignore - Federated module
import PaginationControls from "ncrs-host/PaginationControls";
// @ts-ignore - Federated module
import {
    spineDateToDisplayDate,
    yearsOldCalculator,
} from "ncrs-host/DateFormatter";
// @ts-ignore - Federated module
import { formatGender } from "ncrs-host/GenderFormatter";
// @ts-ignore - Federated module
import { formatNameToTitleCase } from "ncrs-host/NameFormatter";
// @ts-ignore - Federated module
import { formatNHSNumber } from "ncrs-host/NHSNumberFormatter";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingFn,
    useReactTable,
} from "@tanstack/react-table";
// @ts-ignore - Federated module
import {
    Filters,
    PatientSearchQueryResults,
    PatientSearchResultsTableOptionsUpdate,
    QueryResult,
} from "ncrs-host/AppStateTypes";
import {
    GENDER_FILTER_VALUES,
    HIDE_DECEASED_PATIENTS_LABEL,
    LAST_NAME_FIRST_LABEL,
    PATIENT_SEARCH_ROW_COUNT_ALL,
    PATIENT_SEARCH_ROW_COUNT_OPTIONS,
    PRS_FILTER_COUNT,
    PSR_FILTER_SEARCH_LABEL,
    PSR_RESULT_ROW_DATE_OF_DEATH,
    PSR_RESULT_ROW_DECEASED,
    PSR_RESULT_ROW_DQ_ISSUE,
    RESULTS_FILTER_GENDER_ALL_LABEL,
    RESULTS_FILTER_GENDER_FEMALE_LABEL,
    RESULTS_FILTER_GENDER_LABEL,
    RESULTS_FILTER_GENDER_MALE_LABEL,
} from "../../constants/PatientSearchResultsStrings";

export const formatPracticeCode = (row: QueryResult) => {
    if (row.sensitiveData) {
        return NOT_AVAILABLE;
    }
    if (row.practiceCode === NO_PRIMARY_CARE_PROVIDER_CODE) {
        return NOT_RECORDED;
    }
    if (row.practiceCode === GP_PRACTICE_CODE_NOT_APPLICABLE) {
        return NOT_APPLICABLE;
    }
    if (row.practiceCode === GP_PRACTICE_CODE_NOT_KNOWN) {
        return NOT_KNOWN;
    }
    return row.practiceCode ? row.practiceCode : NOT_RECORDED;
};

export const sortByFirstName: SortingFn<QueryResult> = (
    rowA,
    rowB,
    _columnId
) => {
    const rowAFirstName = rowA.original.firstName.toLowerCase();
    const rowBFirstName = rowB.original.firstName.toLowerCase();
    if (rowAFirstName < rowBFirstName) {
        return -1;
    }
    if (rowAFirstName > rowBFirstName) {
        return 1;
    }
    const fullNameRowA = `${rowAFirstName} ${rowA.original.lastName.toLowerCase()}`;
    const fullNameRowB = `${rowBFirstName} ${rowB.original.lastName.toLowerCase()}`;
    if (fullNameRowA < fullNameRowB) {
        return -1;
    }
    if (fullNameRowA > fullNameRowB) {
        return 1;
    }
    return 0;
};

export const sortByLastName: SortingFn<QueryResult> = (
    rowA,
    rowB,
    _columnId
) => {
    const rowALastName = rowA.original.lastName.toLowerCase();
    const rowBLastName = rowB.original.lastName.toLowerCase();
    if (rowALastName < rowBLastName) {
        return -1;
    }
    if (rowALastName > rowBLastName) {
        return 1;
    }
    const fullNameRowA = `${rowALastName} ${rowA.original.firstName.toLowerCase()}`;
    const fullNameRowB = `${rowBLastName} ${rowB.original.firstName.toLowerCase()}`;
    if (fullNameRowA < fullNameRowB) {
        return -1;
    }
    if (fullNameRowA > fullNameRowB) {
        return 1;
    }
    return 0;
};

export const sortByDob: SortingFn<QueryResult> = (rowA, rowB, _columnId) => {
    if (rowA.original.dob < rowB.original.dob) {
        return -1;
    }
    if (rowA.original.dob > rowB.original.dob) {
        return 1;
    }
    return 0;
};

export const sortByAddress: SortingFn<QueryResult> = (
    rowA,
    rowB,
    _columnId
) => {
    if (rowA.original.postcode === rowB.original.postcode) {
        return evaluateAlphabeticalItems(
            rowA.original.address,
            rowB.original.address
        );
    }
    return evaluateAlphabeticalItems(
        rowA.original.postcode,
        rowB.original.postcode
    );
};

const DEFAULT_HIDE_DECEASED = false;
const DEFAULT_GENDER_FILTER = GENDER_FILTER_VALUES.all;

const hasActiveFilters = (filters: Filters) => {
    return (
        (filters.hideDeceased &&
            filters.hideDeceased != DEFAULT_HIDE_DECEASED) ||
        (filters.gender && filters.gender != DEFAULT_GENDER_FILTER) ||
        (filters.text && filters.text != "")
    );
};

const applyFilters = (
    queryResults: Array<QueryResult>,
    filters: Filters
): Array<QueryResult> => {
    const filteredResults = queryResults.filter((result) => {
        return (
            (!filters.gender ||
                filters.gender == DEFAULT_GENDER_FILTER ||
                result.gender == filters.gender) &&
            (filters.hideDeceased == undefined ||
                filters.hideDeceased == false ||
                (filters.hideDeceased && isEmpty(result.dateOfDeath)))
        );
    });
    return filteredResults;
};

const QueryResultsTable: React.FC<{
    queryResults: PatientSearchQueryResults;
    nhsNumberSearch: (n: string) => void;
    paginationPreference: number;
    changeTableOptions: (u: PatientSearchResultsTableOptionsUpdate) => void;
}> = (props) => {
    const initialFilter = props.queryResults.options?.filterBy ?? {
        gender: DEFAULT_GENDER_FILTER,
        hideDeceased: DEFAULT_HIDE_DECEASED,
        text: "",
    };
    const initialSort = props.queryResults.options?.sortBy || [
        { id: "matchingLevel", desc: true },
        { id: "nhsNumber", desc: true },
    ];
    const initialPagination = props.queryResults.options?.pagination || {
        pageSize: props.paginationPreference,
        pageIndex: 0,
    };
    const initialScrollPosition =
        props.queryResults.options?.scrollPosition ?? 0;

    const [lastNameFirst, setLastNameFirst] = useState(
        props.queryResults.options?.lastNameFirst == true || false
    );
    const [filters, setFilters] = useState(initialFilter);
    const [globalFilter, setGlobalFilter] = useState(initialFilter?.text || "");
    const [data, _setData] = React.useState((): QueryResult[] => [
        ...props.queryResults.results,
    ]);

    useEffect(() => {
        _setData(applyFilters(props.queryResults.results, filters));
    }, [filters, props.queryResults.results]);

    const columnHelper = createColumnHelper<QueryResult>();

    const columns = [
        columnHelper.accessor("fullName", {
            header: "Name",
            cell: (info) => {
                const originalRow = info.row.original;
                const initialCaseFirstName = formatNameToTitleCase(
                    originalRow.firstName
                );
                const upperCaseLastName = originalRow.lastName.toUpperCase();
                return (
                    <>
                        {originalRow.dataQualityIssues && (
                            <span
                                className={
                                    "query-results-table__data-row-quality-warning"
                                }
                            >
                                {PSR_RESULT_ROW_DQ_ISSUE}
                            </span>
                        )}
                        <p className={"query-results-table__data-row-name"}>
                            {lastNameFirst ?
                                `${upperCaseLastName}, ${initialCaseFirstName} ${
                                    originalRow.dateOfDeath &&
                                    PSR_RESULT_ROW_DECEASED
                                }`
                            :   `${initialCaseFirstName} ${upperCaseLastName} ${
                                    originalRow.dateOfDeath &&
                                    PSR_RESULT_ROW_DECEASED
                                }`
                            }
                        </p>
                        {originalRow.dateOfDeath && (
                            <span
                                className={
                                    "query-results-table__data-row-date-of-death"
                                }
                            >
                                {PSR_RESULT_ROW_DATE_OF_DEATH +
                                    spineDateToDisplayDate(
                                        originalRow.dateOfDeath
                                    )}
                            </span>
                        )}
                    </>
                );
            },
            id: "name",
            sortingFn: lastNameFirst ? sortByLastName : sortByFirstName,
        }),
        columnHelper.accessor(
            (row) => {
                return formatGender(row.gender);
            },
            {
                header: "Gender",
                cell: (info) => formatGender(info.getValue()),
            }
        ),
        columnHelper.accessor("dob", {
            header: "DOB (Age)",
            cell: (info) => {
                const dob = info.renderValue();
                if (dob != null) {
                    return (
                        <>
                            {spineDateToDisplayDate(dob)}
                            {" ("}
                            {yearsOldCalculator(
                                info.row.original.dob,
                                info.row.original.dateOfDeath
                            )}
                            {")"}
                        </>
                    );
                }
            },
            sortingFn: sortByDob,
        }),
        columnHelper.accessor(
            (row) => {
                return row.sensitiveData ? NOT_AVAILABLE : row.address;
            },
            {
                header: "Address",
                cell: (info) => {
                    return info.row.original.sensitiveData ?
                            NOT_AVAILABLE
                        :   info.getValue();
                },
                sortingFn: sortByAddress,
            }
        ),
        columnHelper.accessor("nhsNumber", {
            header: "NHS No",
            cell: (info) => (
                <div className={"query-results-table__data-row-nhsNumber"}>
                    {formatNHSNumber(info.getValue())}
                </div>
            ),
            id: "nhsNumber",
        }),
        columnHelper.accessor(
            (row) => {
                // Sorting logic dictates that Null values for 'matchingLevel' should be treated as matchingLevel = 100
                return row.matchingLevel ? Number(row.matchingLevel) : 100;
            },
            {
                header: "Matching Level",
                cell: (info) => {
                    return info.getValue() ? info.getValue() : 100;
                },
                id: "matchingLevel",
            }
        ),
        columnHelper.accessor((row) => formatPracticeCode(row), {
            header: "GP Code",
            cell: (info) => {
                return formatPracticeCode(info.row.original);
            },
        }),
    ];

    const rowCountOptions = PATIENT_SEARCH_ROW_COUNT_OPTIONS.map(
        (pageSize, index) => ({
            value: pageSize,
            label:
                index === PATIENT_SEARCH_ROW_COUNT_OPTIONS.length - 1 ?
                    PATIENT_SEARCH_ROW_COUNT_ALL
                :   pageSize,
        })
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            columnVisibility: {
                matchingLevel: false,
            },
            sorting: initialSort,
            pagination: initialPagination,
            globalFilter: "",
        },
        state: {
            globalFilter: globalFilter ?? "",
        },
        onGlobalFilterChange: (value) => setGlobalFilter(value ?? ""),
        getFilteredRowModel: getFilteredRowModel(),
        manualFiltering: false,
    });

    useEffect(
        () =>
            window.scroll({
                top: initialScrollPosition,
                left: 0,
                behavior: "instant",
            }),
        []
    );

    if (props.queryResults.resultsCount <= 0) {
        return null;
    }

    return (
        <>
            <div className="query-results-section-filter-header">
                <div className="query-results-section-filter-count-container">
                    {hasActiveFilters(filters) ?
                        <p className="query-results-section-filter-count">
                            {Mustache.render(PRS_FILTER_COUNT, {
                                filteredNumber: table.getRowCount(),
                                totalResults: props.queryResults.resultsCount,
                            })}{" "}
                            <a
                                id={RESULTS_FILTER_CLEAR_ID}
                                role="button"
                                aria-label={RESET}
                                onClick={() => {
                                    setGlobalFilter("");
                                    props.changeTableOptions({
                                        filters: {},
                                    });
                                    setFilters({});
                                }}
                                onKeyDown={() =>
                                    OnEnterPressed(() => {
                                        setGlobalFilter("");
                                        props.changeTableOptions({
                                            filters: {},
                                        });
                                        setFilters({});
                                    })
                                }
                                tabIndex={0}
                            >
                                {RESET}
                            </a>
                        </p>
                    :   <p className="query-results-section-filter-count__empty" />
                    }
                </div>
            </div>
            <div className="query-results-section">
                <Form disableErrorFromComponents={false}>
                    <div className="query-results-filter-section flex-row">
                        <Fieldset>
                            <Fieldset.Legend
                                id={RESULTS_FILTER_SEARCH_LABEL_ID}
                                className="form-label"
                            >
                                {PSR_FILTER_SEARCH_LABEL}
                            </Fieldset.Legend>
                            <TextInput
                                name="text filter"
                                aria-labelledby={RESULTS_FILTER_SEARCH_LABEL_ID}
                                id={RESULTS_FILTER_SEARCH_ID}
                                autoComplete="off"
                                width="20"
                                type="text"
                                onChange={(e: React.ChangeEvent<any>) => {
                                    const newFilters: Filters = {
                                        ...filters,
                                        text: e.target.value,
                                    };
                                    props.changeTableOptions({
                                        filters: newFilters,
                                    });
                                    setFilters(newFilters);
                                    setGlobalFilter(e.target.value);
                                }}
                                value={globalFilter ?? ""}
                            />
                        </Fieldset>
                        <Fieldset>
                            <Fieldset.Legend
                                id={RESULTS_FILTER_GENDER_LABEL_ID}
                                className="form-label"
                            >
                                {RESULTS_FILTER_GENDER_LABEL}
                            </Fieldset.Legend>
                            <SmallRadios
                                onChange={(e: React.ChangeEvent<any>) => {
                                    const newFilters: Filters = {
                                        ...filters,
                                        gender: e.target.value,
                                    };
                                    props.changeTableOptions({
                                        filters: newFilters,
                                    });
                                    setFilters(newFilters);
                                }}
                                name="gender filter"
                                id={RESULTS_FILTER_GENDER_ID}
                                inline
                            >
                                <Radios.Item
                                    value={GENDER_FILTER_VALUES.all}
                                    checked={
                                        isEmpty(filters?.gender) ||
                                        filters?.gender ===
                                            GENDER_FILTER_VALUES.all
                                    }
                                >
                                    {RESULTS_FILTER_GENDER_ALL_LABEL}
                                </Radios.Item>
                                <Radios.Item
                                    value={GENDER_FILTER_VALUES.male}
                                    checked={
                                        filters?.gender ===
                                        GENDER_FILTER_VALUES.male
                                    }
                                >
                                    {RESULTS_FILTER_GENDER_MALE_LABEL}
                                </Radios.Item>
                                <Radios.Item
                                    value={GENDER_FILTER_VALUES.female}
                                    checked={
                                        filters?.gender ===
                                        GENDER_FILTER_VALUES.female
                                    }
                                >
                                    {RESULTS_FILTER_GENDER_FEMALE_LABEL}
                                </Radios.Item>
                            </SmallRadios>
                        </Fieldset>
                        <Fieldset>
                            <Fieldset.Legend
                                id={RESULTS_FILTER_CHECKBOXES_LABEL_ID}
                                className="form-label"
                            />
                            <SmallCheckboxes
                                id={RESULTS_FILTER_CHECKBOXES}
                                className="results-filter-checkboxes"
                            >
                                <Checkboxes.Item
                                    id={RESULTS_LAST_NAME_FIRST_ID}
                                    {...{
                                        checked: lastNameFirst,
                                        onChange: () => {
                                            props.changeTableOptions({
                                                lastNameFirst: !lastNameFirst,
                                            });
                                            setLastNameFirst(!lastNameFirst);
                                        },
                                    }}
                                >
                                    {LAST_NAME_FIRST_LABEL}
                                </Checkboxes.Item>
                                <Checkboxes.Item
                                    id={RESULTS_DECEASED_SORT_ID}
                                    {...{
                                        checked: filters?.hideDeceased,
                                        onChange: () => {
                                            const newFilters: Filters = {
                                                ...filters,
                                                hideDeceased:
                                                    !filters?.hideDeceased,
                                            };
                                            props.changeTableOptions({
                                                filters: newFilters,
                                            });
                                            setFilters(newFilters);
                                        },
                                    }}
                                >
                                    {HIDE_DECEASED_PATIENTS_LABEL}
                                </Checkboxes.Item>
                            </SmallCheckboxes>
                        </Fieldset>
                    </div>
                </Form>

                <table className="query-results-table">
                    <thead className="query-results-table__header">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <a
                                                className={classNames(
                                                    `sort-toggle-link-${header.id}`,
                                                    {
                                                        "direction-up":
                                                            header.column.getIsSorted() ===
                                                            "asc",
                                                        "direction-down":
                                                            header.column.getIsSorted() ===
                                                            "desc",
                                                    }
                                                )}
                                                role="button"
                                                tabIndex={0}
                                                onClick={header.column.getToggleSortingHandler()}
                                                onKeyDown={header.column.getToggleSortingHandler()}
                                                title={
                                                    header.column.getCanSort() ?
                                                        (
                                                            header.column.getNextSortingOrder() ===
                                                            "asc"
                                                        ) ?
                                                            SORT_ASC
                                                        : (
                                                            header.column.getNextSortingOrder() ===
                                                            "desc"
                                                        ) ?
                                                            SORT_DESC
                                                        :   SORT_CLEAR
                                                    :   undefined
                                                }
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                            </a>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <tr
                                key={row.id}
                                tabIndex={0}
                                className={classNames(
                                    "query-results-table__data-row",
                                    {
                                        "query-results-table__data-row--alternate":
                                            index % 2 == 0,
                                    },
                                    {
                                        "query-results-table__data-row--deceased":
                                            row.original.dateOfDeath,
                                    }
                                )}
                                onClick={() => {
                                    props.nhsNumberSearch(
                                        row.original.nhsNumber
                                    );
                                    props.changeTableOptions({
                                        sort: table.getState().sorting,
                                        pagination: table.getState().pagination,
                                        scrollPosition: window.scrollY,
                                    });
                                }}
                                onKeyDown={OnEnterPressed(() => {
                                    props.nhsNumberSearch(
                                        row.original.nhsNumber
                                    );
                                    props.changeTableOptions({
                                        sort: table.getState().sorting,
                                        pagination: table.getState().pagination,
                                        scrollPosition: window.scrollY,
                                    });
                                })}
                            >
                                {row.getVisibleCells().map((cell, index) => (
                                    <td
                                        key={cell.id}
                                        id={cell.id + index}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="query-results-pagination">
                    <PaginationControls
                        rTable={table}
                        rowCountOptions={rowCountOptions}
                    />
                </div>
            </div>
        </>
    );
};

export default QueryResultsTable;
