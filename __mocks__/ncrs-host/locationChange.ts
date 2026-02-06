export const KEEP_SEARCH_FORM = 'KEEP_SEARCH_FORM'
export const KEEP_PATIENT = 'KEEP_PATIENT'
export const KEEP_QUERY = 'KEEP_QUERY'

export const clearStateOnRequest = (
  payload: any,
  keepFlag: string,
  currentState: any,
  resetState: any
) => {
  if (payload?.location?.state?.[keepFlag]) {
    return currentState
  }
  return resetState
}
