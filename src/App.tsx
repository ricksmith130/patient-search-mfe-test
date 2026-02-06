import { useEffect } from 'react'
// @ts-ignore
import { addReducer } from 'ncrs-host/store'
import FindPatientView from './views/FindPatientView'
import QueryResultsView from './views/QueryResultsView'
import findPatientReducer from './redux/slices/findPatientSlice'
import queryResultsReducer from './redux/slices/queryResultsSlice'
import patientSearchReducer from './redux/slices/patientSearchSlice'

function App() {
  useEffect(() => {
    addReducer('findPatient', findPatientReducer)
    addReducer('query', queryResultsReducer)
    addReducer('patientSearch', patientSearchReducer)
  }, [])

  // Use window.location - host manages routing via redux-first-history
  const isSearchResults = window.location.pathname.includes('/search_results')

  if (isSearchResults) {
    return <QueryResultsView />
  }

  return <FindPatientView />
}

export default App
