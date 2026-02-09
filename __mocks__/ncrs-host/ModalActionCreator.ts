export const createCloseModalAction = () => ({
  type: 'CLOSE_ACTIVE_MODAL',
})

export const createPatientNotFoundModalAction = () => ({
  type: 'PATIENT_NOT_FOUND_MODAL',
})

export const createRetrievalBlockedModalAction = (responseDetails: any) => ({
  type: 'RETRIEVAL_BLOCKED_MODAL',
  errorMsg: String(responseDetails?.reason),
})
