import { createSlice, PayloadAction, isAnyOf } from "@reduxjs/toolkit";
import { LOCATION_CHANGE } from "redux-first-history";
// @ts-ignore
import { DateInputMethods } from "ncrs-host/DateConstants";
// @ts-ignore
import { getEmptyDateParts } from "ncrs-host/SampleEmptyStates";
// @ts-ignore
import { clearStateOnRequest, KEEP_SEARCH_FORM } from "ncrs-host/locationChange";
// @ts-ignore
import {
  RESET_PATIENT_SEARCH_FORM_STATE,
  PATIENT_CHANGED
} from "ncrs-host/ActionTypes";
import {
  performBasicSearch,
  performAdvancedSearch,
  performPostcodeSearch,
} from "../thunks/patientSearchThunks";
// @ts-ignore
import type { FindPatientStates, SearchFormUpdate } from "ncrs-host/AppStateTypes";

const initialState: FindPatientStates = {
  dateInputMethods: {
    dob: DateInputMethods.DateRange,
    dod: DateInputMethods.DateRange,
  },
  dobTo: getEmptyDateParts(),
  dobFrom: getEmptyDateParts(),
  gender: "",
  surname: "",
  firstname: "",
  postcode: "",
  dodFrom: getEmptyDateParts(),
  dodTo: getEmptyDateParts(),
  addressEffectiveFrom: getEmptyDateParts(),
  addressEffectiveTo: getEmptyDateParts(),
  algorithmicSearch: false,
  includeDod: false,
};

const findPatientSlice = createSlice({
  name: "findPatient",
  initialState,
  reducers: {
    updateFormState: (state, action: PayloadAction<SearchFormUpdate>) => {
      return {
        ...state,
        ...action.payload,
        dateInputMethods: {
          ...state.dateInputMethods,
          ...action.payload.dateInputMethods,
        },
      };
    },
    resetFormState: (state) => {
      return {
        ...initialState,
        dateInputMethods: state.dateInputMethods,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action): action is { type: typeof LOCATION_CHANGE; payload: any } =>
          action.type === LOCATION_CHANGE,
        (state, action) => {
          const newState = clearStateOnRequest(
            action.payload,
            KEEP_SEARCH_FORM,
            state,
            {
              ...initialState,
              dateInputMethods: state.dateInputMethods,
            }
          );
          if (newState !== state) {
            return newState;
          }
        }
      )
      .addMatcher(
        isAnyOf(
          performBasicSearch.fulfilled,
          performAdvancedSearch.fulfilled,
          performPostcodeSearch.fulfilled
        ),
        (state) => {
          return {
            ...initialState,
            dateInputMethods: state.dateInputMethods,
          };
        }
      )
      .addMatcher(
        (action) =>
          action.type === RESET_PATIENT_SEARCH_FORM_STATE ||
          action.type === PATIENT_CHANGED,
        (state) => {
          return {
            ...initialState,
            dateInputMethods: state.dateInputMethods,
          };
        }
      );
  },
});

export const { updateFormState, resetFormState } = findPatientSlice.actions;
export default findPatientSlice.reducer;
