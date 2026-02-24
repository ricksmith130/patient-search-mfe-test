import { useEffect } from "react";
// @ts-ignore
import { addReducer } from "ncrs-host/store";
import FindPatientView from "./views/FindPatientView";
import QueryResultsView from "./views/QueryResultsView";
import findPatientReducer from "./redux/slices/findPatientSlice";
import queryResultsReducer from "./redux/slices/queryResultsSlice";
import patientSearchReducer from "./redux/slices/patientSearchSlice";
import { Route, Routes } from "react-router-dom";

function App() {
  useEffect(() => {
    addReducer("findPatient", findPatientReducer);
    addReducer("query", queryResultsReducer);
    addReducer("patientSearch", patientSearchReducer);
  }, []);
  return (
    <Routes>
      <Route path="/" element={<FindPatientView />} />
      <Route path="/search_results" element={<QueryResultsView />} />
    </Routes>
  );
}

export default App;
