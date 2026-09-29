import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

// 25 courses: two pages at 18 per page.
vi.mock('../data', async (importOriginal) => {
  const original = await importOriginal<typeof import('../data')>()
  const extra = Array.from({ length: 25 - original.courses.length }, (_, index) => ({
    ...original.courses[0],
    slug: `extra-${index}`,
    title: `Extra course ${index}`,
  }))
  return { ...original, courses: [...original.courses, ...extra] }
})

const { default: App } = await import('../App')

describe('search pagination with more than one page', () => {
  it('renders the real page count and moves between pages', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>,
    )
    const pager = screen.getByRole('navigation', { name: /search result pages/i })
    expect(screen.getAllByRole('article')).toHaveLength(18)
    expect(within(pager).getAllByRole('button', { name: /^\d+$/ })).toHaveLength(2)
    expect(within(pager).getByRole('button', { name: 'Previous page' })).toBeDisabled()

    await user.click(within(pager).getByRole('button', { name: 'Next page' }))
    expect(screen.getAllByRole('article')).toHaveLength(7)
    expect(within(pager).getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(within(pager).getByRole('button', { name: 'Next page' })).toBeDisabled()

    await user.click(within(pager).getByRole('button', { name: '1' }))
    expect(screen.getAllByRole('article')).toHaveLength(18)
  })
})
