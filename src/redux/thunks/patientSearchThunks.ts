import { createAsyncThunk } from "@reduxjs/toolkit";
import { ncrsFetch } from "ncrs-host/HttpClient";
import {
  navigateToSearchResultsAction,
  navigateToAdvancedSearchAction,
  navigateToPostcodeSearchAction,
} from "ncrs-host/NavigationActions";
import { activateBasicSearchTab } from "ncrs-host/TabActionCreator";
import urlConfig from "ncrs-host/UrlConfig";
import type { QueryArguments, PostcodeSearchArguments } from "ncrs-host/AppStateTypes";

export const performBasicSearch = createAsyncThunk(
  "queryResults/performBasicSearch",
  async (query: QueryArguments, { dispatch, rejectWithValue }) => {
    try {
      const response = await ncrsFetch(urlConfig.basic_search_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw await response.json().catch(() => ({ status: response.status }));
      }

      const queryResults = await response.json();
      dispatch(navigateToSearchResultsAction());
      return queryResults;
    } catch (error) {
      dispatch(activateBasicSearchTab());
      return rejectWithValue(error);
    }
  }
);

export const performAdvancedSearch = createAsyncThunk(
  "queryResults/performAdvancedSearch",
  async (query: QueryArguments, { dispatch, rejectWithValue }) => {
    try {
      const response = await ncrsFetch(urlConfig.advanced_search_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw await response.json().catch(() => ({ status: response.status }));
      }

      const queryResults = await response.json();
      dispatch(navigateToSearchResultsAction());
      return queryResults;
    } catch (error) {
      const actions = navigateToAdvancedSearchAction();
      actions.forEach((action) => dispatch(action));
      return rejectWithValue(error);
    }
  }
);

export const performPostcodeSearch = createAsyncThunk(
  "queryResults/performPostcodeSearch",
  async (query: PostcodeSearchArguments, { dispatch, rejectWithValue }) => {
    try {
      const response = await ncrsFetch(urlConfig.postcode_search_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw await response.json().catch(() => ({ status: response.status }));
      }

      const queryResults = await response.json();
      dispatch(navigateToSearchResultsAction());
      return queryResults;
    } catch (error) {
      const actions = navigateToPostcodeSearchAction();
      actions.forEach((action) => dispatch(action));
      return rejectWithValue(error);
    }
  }
);
