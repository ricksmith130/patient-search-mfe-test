import React from 'react'
import { Provider } from 'react-redux'
import { render as rtlRender } from '@testing-library/react'
import { configureStore, Middleware, UnknownAction } from '@reduxjs/toolkit'

export const renderWithStore = (
  component: React.ReactElement,
  storeData: Record<string, any> = {}
) => {
  const actions: UnknownAction[] = []
  const actionRecorder: Middleware = () => (next) => (action) => {
    actions.push(action as UnknownAction)
    return next(action)
  }

  const store = configureStore({
    reducer: () => storeData,
    preloadedState: storeData,
    middleware: (getDefault) => getDefault().concat(actionRecorder),
  })

  const renderResult = rtlRender(
    <Provider store={store}>{component}</Provider>
  )
  return { ...renderResult, store, getActions: () => actions }
}
