export const updateFormState = (update: any) => ({
  type: 'findPatient/updateFormState',
  payload: update,
})

export const resetFormState = () => ({
  type: 'findPatient/resetFormState',
})
