import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// @ts-ignore
import {
  NHS_NUMBER_SEARCH_REQUESTED,
  NHS_NUMBER_SEARCH_FAILED,
  PATIENT_CHANGED,
  PATIENT_UPDATED
} from "ncrs-host/ActionTypes";

export interface PatientSearchState {
  isSearching: boolean;
  searchUuid: string;
  searchToken: string;
}

const initialState: PatientSearchState = {
  isSearching: false,
  searchUuid: "",
  searchToken: "",
};

const patientSearchSlice = createSlice({
  name: "patientSearch",
  initialState,
  reducers: {
    nhsSearchRequested: (state, action: PayloadAction<{ nhsNumber: string; uuid: string }>) => {
      state.isSearching = true;
      state.searchUuid = action.payload.uuid;
      state.searchToken = action.payload.nhsNumber;
    },
    nhsSearchFailed: (state) => {
      state.isSearching = false;
    },
    patientChanged: (state) => {
      state.isSearching = false;
      state.searchToken = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type === NHS_NUMBER_SEARCH_REQUESTED,
        (state, action: any) => {
          state.isSearching = true;
          state.searchUuid = action.uuid;
          state.searchToken = action.nhsNumber;
        }
      )
      .addMatcher(
        (action) => action.type === NHS_NUMBER_SEARCH_FAILED,
        (state) => {
          state.isSearching = false;
        }
      )
      .addMatcher(
        (action) => action.type === PATIENT_CHANGED || action.type === PATIENT_UPDATED,
        (state) => {
          state.isSearching = false;
          state.searchToken = "";
        }
      );
  },
});

export const { nhsSearchRequested, nhsSearchFailed, patientChanged } = patientSearchSlice.actions;
export default patientSearchSlice.reducer;
