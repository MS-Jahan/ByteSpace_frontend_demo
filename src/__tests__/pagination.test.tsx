import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'

// 90 courses: five pages at 18 per page, as in the design's pager.
describe('search pagination', () => {
  it('renders five pages and moves between them', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>,
    )
    const pager = screen.getByRole('navigation', { name: /search result pages/i })
    expect(screen.getAllByRole('article')).toHaveLength(18)
    expect(within(pager).getAllByRole('button', { name: /^\d+$/ })).toHaveLength(5)
    expect(within(pager).getByRole('button', { name: 'Previous page' })).toBeDisabled()

    await user.click(within(pager).getByRole('button', { name: 'Next page' }))
    expect(within(pager).getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')

    await user.click(within(pager).getByRole('button', { name: '5' }))
    expect(screen.getAllByRole('article')).toHaveLength(18)
    expect(within(pager).getByRole('button', { name: 'Next page' })).toBeDisabled()

    await user.click(within(pager).getByRole('button', { name: '1' }))
    expect(within(pager).getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })
})
