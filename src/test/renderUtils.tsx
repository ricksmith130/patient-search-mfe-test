import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render as rtlRender } from '@testing-library/react'
import { createTestStore, TestState } from './testStoreUtils'

/**
 * Renders component with Redux store
 * For integration tests with real federation
 */
export const renderWithStore = (
  component: React.ReactElement,
  initialState?: Partial<TestState>
) => {
  const store = createTestStore(initialState)
  const renderResult = rtlRender(
    <Provider store={store}>{component}</Provider>
  )
  return { ...renderResult, store }
}

/**
 * Renders component with router and store
 * Use for components that need routing context
 */
export const renderWithRouterAndStore = (
  component: React.ReactElement,
  initialState?: Partial<TestState>,
  initialRoute = '/'
) => {
  const store = createTestStore(initialState)
  const renderResult = rtlRender(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        {component}
      </MemoryRouter>
    </Provider>
  )
  return { ...renderResult, store }
}
