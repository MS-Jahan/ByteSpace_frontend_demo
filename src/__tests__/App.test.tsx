import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'

function renderApp(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  )
}

describe('ByteSpace routes and landing interactions', () => {
  it('renders the landing page and navigates to the signup route', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(screen.getByRole('heading', { name: /get access to hundreds of courses available/i })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /start creating/i }))
    expect(screen.getByRole('heading', { name: /welcome to bytespace/i })).toBeInTheDocument()
  })

  it('filters the local course catalog by query and category', async () => {
    const user = userEvent.setup()
    renderApp()

    const catalog = document.getElementById('courses')
    expect(catalog).not.toBeNull()
    await user.click(within(catalog as HTMLElement).getByRole('button', { name: 'Development' }))
    expect(within(catalog as HTMLElement).getByRole('heading', { name: /learn to code/i })).toBeInTheDocument()
    expect(within(catalog as HTMLElement).queryByRole('heading', { name: /build digital assets/i })).not.toBeInTheDocument()

    await user.click(within(catalog as HTMLElement).getByRole('button', { name: 'Design' }))
    expect(within(catalog as HTMLElement).getByRole('heading', { name: /build digital assets/i })).toBeInTheDocument()
  })

  it('shows a useful empty state when the search has no matches', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByRole('searchbox', { name: /search courses/i }), 'unfindable course')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(screen.getByRole('heading', { name: /no courses found/i })).toBeInTheDocument()
  })

  it('requires an agreement checkbox to create a demo account', async () => {
    const user = userEvent.setup()
    renderApp('/signup')

    await user.type(screen.getByLabelText(/full name/i), 'Jamie Davis')
    await user.type(screen.getByLabelText('Email'), 'jamie@example.com')
    await user.type(screen.getByLabelText('Password'), 'longpassword')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByRole('checkbox')).toBeInvalid()
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByRole('heading', { name: /you’re on your way/i })).toBeInTheDocument()
    expect(screen.getByText(/no account was created and no credentials were sent/i)).toBeInTheDocument()
  })

  it('shows demo-only feedback after valid login credentials are submitted', async () => {
    const user = userEvent.setup()
    renderApp('/login')

    await user.type(screen.getByLabelText(/^email$/i), 'learner@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'learning123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByRole('heading', { name: /you’re signed in/i })).toBeInTheDocument()
    expect(screen.getByText(/no account was created and no credentials were sent/i)).toBeInTheDocument()
  })

  it('keeps newsletter signup local and confirms that no email is sent or saved', async () => {
    const user = userEvent.setup()
    renderApp()

    const emailInput = screen.getByRole('textbox', { name: /email address/i })
    await user.type(emailInput, 'learner@example.com')
    await user.click(screen.getByRole('button', { name: 'Subscribe' }))

    expect(screen.getByText(/this demo did not send or save your email/i)).toBeInTheDocument()
    expect(emailInput).toHaveValue('')
  })

  it('renders the branded not-found route', () => {
    renderApp('/not-a-route')
    expect(screen.getByRole('heading', { name: /page you’re looking for doesn’t exist/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
  })
})
