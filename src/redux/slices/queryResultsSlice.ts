import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCATION_CHANGE } from "redux-first-history";
// @ts-ignore
import { clearStateOnRequest, KEEP_SEARCH_RESULTS, KEEP_QUERY } from "ncrs-host/locationChange";
// @ts-ignore
import { CLEAR_PATIENT_SEARCH_DATA, CLEAR_ALL_NON_USER_DATA } from "ncrs-host/ActionTypes";
// @ts-ignore
import { BASIC, ADVANCED, POSTCODE } from "ncrs-host/QueryTypes";
import {
  performBasicSearch,
  performAdvancedSearch,
  performPostcodeSearch,
} from "../thunks/patientSearchThunks";
// @ts-ignore
import type {
  PatientSearchQueryResults,
  QueryArguments,
  PostcodeSearchArguments,
  PatientSearchResultsTableOptionsUpdate,
} from "ncrs-host/AppStateTypes";
// @ts-ignore
import { buildQueryResults, buildQueryArguments, buildPostcodeSearchArguments } from "ncrs-host/QueryBuilder";

const initialQueryResults: PatientSearchQueryResults = {
  results: [],
  resultsCount: 0,
  options: {},
};

const initialQueryArguments: QueryArguments = {
  gender: "",
  surname: "",
  dobFrom: "",
  searchUuid: "",
};

const initialPostcodeSearchArguments: PostcodeSearchArguments = {
  postcode: "",
};

export interface QueryResultsState {
  queryResults: PatientSearchQueryResults;
  queryArguments: QueryArguments;
  postcodeSearchArguments: PostcodeSearchArguments;
  queryType: string;
  hasData: boolean;
}

const initialState: QueryResultsState = {
  queryResults: initialQueryResults,
  queryArguments: initialQueryArguments,
  postcodeSearchArguments: initialPostcodeSearchArguments,
  queryType: "",
  hasData: false,
};

const queryResultsSlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    changeTableOptions: (
      state,
      action: PayloadAction<PatientSearchResultsTableOptionsUpdate>
    ) => {
      const update = action.payload;
      state.queryResults.options = {
        ...state.queryResults.options,
        ...(update.filters && { filterBy: update.filters }),
        ...(update.sort && { sortBy: update.sort }),
        ...(update.pagination && { pagination: update.pagination }),
        ...(update.scrollPosition !== undefined && { scrollPosition: update.scrollPosition }),
        ...(update.lastNameFirst !== undefined && { lastNameFirst: update.lastNameFirst }),
      };
    },
    clearQueryData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(performBasicSearch.pending, (state, action) => {
        state.queryArguments = buildQueryArguments({ ...action.meta.arg }, action.meta.requestId);
        state.queryType = BASIC;
        state.hasData = true;
      })
      .addCase(performBasicSearch.fulfilled, (state, action) => {
        state.queryResults = buildQueryResults(action.payload);
      })
      .addCase(performBasicSearch.rejected, (state) => {
        state.queryResults = { ...initialQueryResults };
      })
      .addCase(performAdvancedSearch.pending, (state, action) => {
        state.queryArguments = buildQueryArguments({ ...action.meta.arg }, action.meta.requestId);
        state.queryType = ADVANCED;
        state.hasData = true;
      })
      .addCase(performAdvancedSearch.fulfilled, (state, action) => {
        state.queryResults = buildQueryResults(action.payload);
      })
      .addCase(performAdvancedSearch.rejected, (state) => {
        state.queryResults = { ...initialQueryResults };
      })
      .addCase(performPostcodeSearch.pending, (state, action) => {
        state.postcodeSearchArguments = buildPostcodeSearchArguments(
          { ...action.meta.arg },
          action.meta.requestId
        );
        state.queryType = POSTCODE;
        state.hasData = true;
      })
      .addCase(performPostcodeSearch.fulfilled, (state, action) => {
        state.queryResults = buildQueryResults(action.payload);
      })
      .addCase(performPostcodeSearch.rejected, (state) => {
        state.queryResults = { ...initialQueryResults };
      })
      .addMatcher(
        (action): action is { type: typeof LOCATION_CHANGE; payload: any } =>
          action.type === LOCATION_CHANGE,
        (state, action) => {
          const keepQuery = clearStateOnRequest(
            action.payload,
            KEEP_QUERY,
            state,
            initialState
          );
          if (keepQuery === initialState) {
            return initialState;
          }
          const keepResults = clearStateOnRequest(
            action.payload,
            KEEP_SEARCH_RESULTS,
            state.queryResults,
            initialQueryResults
          );
          if (keepResults !== state.queryResults) {
            state.queryResults = keepResults;
          }
        }
      )
      .addMatcher(
        (action) =>
          action.type === CLEAR_PATIENT_SEARCH_DATA ||
          action.type === CLEAR_ALL_NON_USER_DATA,
        () => initialState
      );
  },
});

export const { changeTableOptions, clearQueryData } = queryResultsSlice.actions;
export default queryResultsSlice.reducer;
