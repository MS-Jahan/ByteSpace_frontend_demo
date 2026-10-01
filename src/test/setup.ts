import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Vitest runs without globals, so Testing Library cannot register its own
// automatic cleanup; do it explicitly or rendered trees leak between tests.
afterEach(cleanup)

beforeAll(() => {
  // jsdom has no layout engine, so scrolling APIs are stubbed rather than
  // implemented. Layout scrolling is verified in the browser review instead.
  vi.stubGlobal('scrollTo', vi.fn())
  Element.prototype.scrollIntoView = vi.fn()
})
