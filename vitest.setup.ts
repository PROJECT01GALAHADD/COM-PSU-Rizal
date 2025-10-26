import '@testing-library/jest-dom'
import { vi } from 'vitest'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
