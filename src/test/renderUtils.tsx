import React from 'react'
import { Provider } from 'react-redux'
import { render as rtlRender } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'

const createMockStore = configureMockStore()

export const renderWithStore = (
  component: React.ReactElement,
  storeData: Record<string, any> = {}
) => {
  const store = createMockStore(storeData)
  const renderResult = rtlRender(
    <Provider store={store}>{component}</Provider>
  )
  return { ...renderResult, store }
}
