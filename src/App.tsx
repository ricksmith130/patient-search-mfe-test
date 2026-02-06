import { useLocation } from 'react-router-dom'
import FindPatientView from './views/FindPatientView'
import QueryResultsView from './views/QueryResultsView'

function App() {
  const location = useLocation()

  // Check which route we're on and render the appropriate component
  if (location.pathname.includes('/search_results')) {
    return <QueryResultsView />
  }

  // Default to FindPatientView for /find_patient route
  return <FindPatientView />
}

export default App
