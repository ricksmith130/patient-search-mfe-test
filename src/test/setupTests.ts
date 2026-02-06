import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Mock window APIs that jsdom doesn't fully support
beforeAll(() => {
  // Mock scrollTo for NHS.UK components
  global.window.scrollTo = vi.fn()
  global.window.scroll = vi.fn()

  // Mock URL for blob handling
  if (typeof global.URL.createObjectURL === 'undefined') {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
  }
  if (typeof global.URL.revokeObjectURL === 'undefined') {
    global.URL.revokeObjectURL = vi.fn()
  }

  // Mock document.body.classList for NHS.UK frontend
  Object.defineProperty(document.body, 'classList', {
    value: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(() => true),
      toggle: vi.fn(),
    },
    writable: true,
    configurable: true,
  })
})

// Suppress expected React warnings
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: An update to') ||
        args[0].includes('was not wrapped in act'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})
