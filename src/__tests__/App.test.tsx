import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { categories, courseFilters, courses, footerColumns, landingCourses, learningPaths, reviewsFor } from '../data'

const demoCourse = courses.find((course) => course.slug === 'build-digital-asset')!

function renderApp(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  )
}

describe('landing page', () => {
  it('renders the design hero and the full section order', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: /get access to hundreds courses available/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /discover your passion, build your skills/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /explore diverse learning paths at bytespace/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /your path to professional growth starts here/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /create & manage courses easily/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /unlock your potential as a creator with bytespace/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /discover what our community is saying/i })).toBeInTheDocument()
  })

  it('shows the design course cards with lessons, level and lifetime price', () => {
    renderApp()
    const coursesSection = document.getElementById('courses')
    expect(coursesSection).not.toBeNull()
    const card = within(coursesSection as HTMLElement).getByRole('heading', { name: 'Learn Figma from Basic' })
    expect(card).toBeInTheDocument()
    expect(within(coursesSection as HTMLElement).getAllByText('17 Lessons').length).toBeGreaterThan(0)
    expect(within(coursesSection as HTMLElement).getAllByText('/lifetime').length).toBeGreaterThan(0)
  })

  it('filters the course grid with the category pills', async () => {
    const user = userEvent.setup()
    renderApp()
    const coursesSection = document.getElementById('courses') as HTMLElement
    const expected = courses.filter((course) => course.categories.includes('Marketing')).slice(0, 6)
    expect(expected.length).toBeGreaterThan(0)

    await user.click(within(coursesSection).getByRole('button', { name: 'Marketing' }))
    expect(within(coursesSection).getByRole('button', { name: 'Marketing' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(coursesSection).queryByText(/no courses in this category/i)).not.toBeInTheDocument()
    expect(within(coursesSection).getAllByRole('article')).toHaveLength(expected.length)
    for (const course of expected) {
      expect(within(coursesSection).getByRole('heading', { name: course.title })).toBeInTheDocument()
    }
    expect(within(coursesSection).queryByRole('heading', { name: 'Learn Figma from Basic' })).not.toBeInTheDocument()

    await user.click(within(coursesSection).getByRole('button', { name: 'Featured' }))
    expect(within(coursesSection).getByRole('heading', { name: 'Learn Figma from Basic' })).toBeInTheDocument()
    expect(within(coursesSection).getAllByRole('article')).toHaveLength(landingCourses.length)
  })

  it('returns results for every category pill and learning path', async () => {
    const user = userEvent.setup()
    renderApp()
    const coursesSection = document.getElementById('courses') as HTMLElement
    for (const filter of courseFilters) {
      await user.click(within(coursesSection).getByRole('button', { name: filter }))
      expect(within(coursesSection).getAllByRole('article').length, filter).toBeGreaterThan(0)
    }
    for (const path of learningPaths) {
      expect(courses.some((course) => course.categories.includes(path.name)), path.name).toBe(true)
    }
  })

  it('sends the hero search to the search route and reports no matches', async () => {
    const user = userEvent.setup()
    renderApp()

    const heroSearch = screen.getByRole('search')
    await user.type(within(heroSearch).getByRole('searchbox', { name: /search courses/i }), 'unfindable topic')
    await user.click(within(heroSearch).getByRole('button', { name: 'Search' }))

    expect(screen.getByRole('heading', { name: /no courses found/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /find your next course/i })).toBeInTheDocument()
  })

  it('keeps newsletter signup local and confirms nothing was sent', async () => {
    const user = userEvent.setup()
    renderApp()

    const emailInput = screen.getByRole('textbox', { name: /email address/i })
    const newsletter = emailInput.closest('form') as HTMLFormElement
    await user.type(emailInput, 'learner@example.com')
    await user.click(within(newsletter).getByRole('button', { name: 'Search' }))

    expect(screen.getByText(/this demo did not send or save your email/i)).toBeInTheDocument()
    expect(emailInput).toHaveValue('')
  })
})

describe('navigation', () => {
  it('links to the signup route from the creator call to action', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getAllByRole('link', { name: /join as creator/i })[0])
    expect(screen.getByRole('heading', { name: /welcome to bytespace/i })).toBeInTheDocument()
  })

  it('exposes working header links on every routed page', () => {
    const routes = ['/', '/search', `/courses/${courses[0].slug}`, `/creators/purepearl-studio`, '/legal', '/nope']
    for (const route of routes) {
      const { unmount } = renderApp(route)
      const nav = screen.getAllByRole('navigation', { name: 'Main' })[0]
      expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
      expect(within(nav).getByRole('link', { name: 'Courses' })).toHaveAttribute('href', '/search')
      expect(within(nav).getByRole('link', { name: 'Creators' })).toHaveAttribute(
        'href',
        '/creators/purepearl-studio',
      )
      unmount()
    }
  })

  it('sends every footer link to a page that is not the 404', () => {
    renderApp('/search')
    const links = footerColumns.flatMap((column) => column.links)
    for (const { label, to } of links) {
      const link = screen.getAllByRole('link', { name: label })[0]
      expect(link).toHaveAttribute('href', to)

      const { unmount } = renderApp(to)
      expect(screen.queryByRole('heading', { name: /page you are looking for doesn’t exist/i }), label).not.toBeInTheDocument()
      unmount()
    }
  })

  it('links each footer category to search results that exist', () => {
    const categoryLinks = footerColumns.flatMap((column) => column.links).filter((link) => link.to.startsWith('/search?category='))
    expect(categoryLinks.length).toBeGreaterThanOrEqual(7)
    for (const { label, to } of categoryLinks) {
      const name = new URLSearchParams(to.split('?')[1]).get('category') as string
      expect(categories, label).toContain(name)
      const { unmount } = renderApp(to)
      expect(screen.getAllByRole('article').length, label).toBeGreaterThan(0)
      unmount()
    }
  })

  it('opens and closes the mobile menu with the toggle and Escape, returning focus', async () => {
    const user = userEvent.setup()
    renderApp()
    const toggle = screen.getByRole('button', { name: 'Open navigation menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true')
    expect(within(screen.getAllByRole('navigation', { name: 'Main' })[0]).getByRole('button', { name: 'Cart' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('closes the mobile menu when a link inside it navigates', async () => {
    const user = userEvent.setup()
    renderApp()
    const toggle = screen.getByRole('button', { name: 'Open navigation menu' })
    await user.click(toggle)
    await user.click(within(screen.getAllByRole('navigation', { name: 'Main' })[0]).getByRole('link', { name: 'Courses' }))
    expect(screen.getByRole('heading', { name: /find your next course/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('gives every route its own document title', () => {
    const expectations: [string, RegExp][] = [
      ['/', /^ByteSpace — Learn Without Limits$/],
      ['/search', /^Find your next course/],
      [`/courses/${courses[0].slug}`, new RegExp(courses[0].details.fullTitle.slice(0, 12))],
      [`/courses/${courses[0].slug}/lessons`, /Lessons/],
      [`/courses/${courses[0].slug}/reviews`, /Reviews/],
      ['/creators/purepearl-studio', /PurePearl Studio/],
      ['/login', /^Sign in/],
      ['/signup', /^Create your account/],
      ['/legal', /^Policies/],
      ['/nope', /^Page not found/],
    ]
    const seen = new Set<string>()
    for (const [route, pattern] of expectations) {
      const { unmount } = renderApp(route)
      expect(document.title, route).toMatch(pattern)
      expect(document.title, route).toMatch(/ByteSpace/)
      seen.add(document.title)
      unmount()
    }
    expect(seen.size).toBe(expectations.length)
  })

  it('shows an inline error for an invalid or empty newsletter email, then confirms a valid one', async () => {
    const user = userEvent.setup()
    renderApp()
    const emailInput = screen.getByRole('textbox', { name: /email address/i })
    const form = emailInput.closest('form') as HTMLFormElement
    expect(form).toHaveAttribute('novalidate')

    await user.click(within(form).getByRole('button', { name: 'Search' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/valid email address/i)

    await user.type(emailInput, 'not-an-email')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await user.click(within(form).getByRole('button', { name: 'Search' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/valid email address/i)
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')

    await user.clear(emailInput)
    await user.type(emailInput, 'ok@example.com')
    await user.click(within(form).getByRole('button', { name: 'Search' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText(/this demo did not send or save your email/i)).toBeInTheDocument()
  })

  it('gives the footer column headings a level-2 heading each', () => {
    renderApp()
    const footer = screen.getByRole('contentinfo')
    for (const column of footerColumns) {
      expect(within(footer).getByRole('heading', { level: 2, name: column.heading })).toBeInTheDocument()
    }
    expect(within(footer).queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  it('leads a learning path tile to matching search results', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(within(document.getElementById('paths') as HTMLElement).getByRole('link', { name: 'Development' }))
    expect(screen.getByRole('heading', { name: /find your next course/i })).toBeInTheDocument()
    const expected = courses.filter((course) => course.categories.includes('Development')).length
    expect(expected).toBeGreaterThan(0)
    expect(screen.getAllByRole('article')).toHaveLength(expected)
  })
})

describe('course routes', () => {
  it('renders the course shell and switches between tabs', async () => {
    const user = userEvent.setup()
    renderApp(`/courses/${courses[1].slug}`)

    expect(screen.getByRole('heading', { name: courses[1].details.fullTitle })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /this course include/i })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Lessons' }))
    expect(screen.getByRole('heading', { name: /lesson list/i })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Reviews' }))
    expect(screen.getByRole('heading', { name: /individual reviews/i })).toBeInTheDocument()
  })

  it('filters reviews by star rating', async () => {
    const user = userEvent.setup()
    renderApp(`/courses/${demoCourse.slug}/reviews`)
    const courseReviews = reviewsFor(demoCourse.details).items
    const emptyStars = [5, 4, 3, 2, 1].find((stars) => !courseReviews.some((review) => review.rating === stars))
    const withStars = [5, 4, 3, 2, 1].find((stars) => courseReviews.some((review) => review.rating === stars)) as number

    const expectedCount = courseReviews.filter((review) => review.rating === withStars).length
    await user.click(screen.getByRole('button', { name: new RegExp(`^${withStars}$`) }))
    expect(document.querySelectorAll('.review-card')).toHaveLength(expectedCount)

    if (emptyStars) {
      await user.click(screen.getByRole('button', { name: new RegExp(`^${emptyStars}$`) }))
      expect(screen.getByText(new RegExp(`no ${emptyStars}-star reviews yet`, 'i'))).toBeInTheDocument()
    }
    await user.click(screen.getByRole('button', { name: 'All rating' }))
    expect(document.querySelectorAll('.review-card')).toHaveLength(courseReviews.length)
  })

  it('renders the 404 for unknown course and creator slugs, including nested course tabs', () => {
    for (const route of ['/courses/bad', '/courses/bad/lessons', '/courses/bad/reviews', '/creators/nobody']) {
      const { unmount } = renderApp(route)
      expect(screen.getByRole('heading', { name: /page you are looking for doesn’t exist/i }), route).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /find your next course/i })).not.toBeInTheDocument()
      unmount()
    }
  })

  it('keeps the scroll position when switching course tabs, and resets it for other pages', async () => {
    const user = userEvent.setup()
    renderApp(`/courses/${courses[1].slug}`)
    const scrollTo = vi.mocked(window.scrollTo)
    scrollTo.mockClear()

    await user.click(screen.getByRole('link', { name: 'Lessons' }))
    await user.click(screen.getByRole('link', { name: 'Reviews' }))
    expect(scrollTo).not.toHaveBeenCalled()

    await user.click(within(screen.getAllByRole('navigation', { name: 'Main' })[0]).getByRole('link', { name: 'Courses' }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
  })

  it('scrolls to hash targets with an instant jump', async () => {
    const user = userEvent.setup()
    renderApp('/search')
    const scrollIntoView = vi.mocked(Element.prototype.scrollIntoView)
    scrollIntoView.mockClear()
    await user.click(screen.getByRole('link', { name: 'Featured Categories' }))
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' })
  })

  it('shows demo-only notices for Share and Play', async () => {
    const user = userEvent.setup()
    renderApp(`/courses/${courses[0].slug}`)

    await user.click(screen.getByRole('button', { name: /^Share$/ }))
    expect(await screen.findByText(/link copied|copy the address bar link/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^Play the .* preview$/ }))
    expect(screen.getByText(/video playback is not available in this prototype/i)).toBeInTheDocument()
  })

  it('renders a single, chrome-less play control over the poster art', () => {
    renderApp(`/courses/${courses[0].slug}`)

    // Exactly one play affordance, and the poster supplies the artwork - the
    // button must not draw a second play icon on top of the baked-in one.
    const playButtons = screen.getAllByRole('button', { name: /^Play the .* preview$/ })
    expect(playButtons).toHaveLength(1)
    expect(playButtons[0].querySelector('svg')).toBeNull()
  })

  it('draws the rating bars at the design fill widths', async () => {
    const user = userEvent.setup()
    renderApp(`/courses/${demoCourse.slug}/reviews`)

    await user.click(screen.getByRole('link', { name: 'Reviews' }))
    const widths = [...document.querySelectorAll('.rating-summary__track > span')].map(
      (fill) => (fill as HTMLElement).style.width,
    )
    // The design's fills are hand-set (92/36/9/3/5), not proportional to the counts.
    expect(widths).toEqual(['92%', '36%', '9%', '3%', '5%'])
  })

  it('shows each course its own figures instead of the demo course content', () => {
    const course = courses.find((entry) => entry.slug === 'fitness-habits-for-busy-people')!
    renderApp(`/courses/${course.slug}/reviews`)

    const { details } = course
    expect(screen.getByText(`${details.rating.toFixed(1)} (${details.reviewCount} reviews)`)).toBeInTheDocument()
    expect(document.querySelector('.rating-summary__score strong')).toHaveTextContent(details.rating.toFixed(1))
    const counts = [...document.querySelectorAll('.rating-summary__count')].map((node) => Number(node.textContent))
    expect(counts.reduce((sum, count) => sum + count, 0)).toBe(details.reviewCount)
    const bars = [...document.querySelectorAll('.rating-summary__track > span')].map((fill) => (fill as HTMLElement).style.width)
    expect(bars).toContain('100%')
    expect(screen.getByText(new RegExp(`experience with ‘${details.fullTitle}`))).toBeInTheDocument()
    expect(screen.queryByText(/Build Digital Assets/)).not.toBeInTheDocument()
    expect(screen.getByText(`${details.totalLessons - 3} more videos`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: `${details.totalLessons} Lessons (${details.totalDuration})` })).toBeInTheDocument()
  })

  it('keeps the design figures for the demo course', () => {
    renderApp(`/courses/${demoCourse.slug}`)
    expect(screen.getByText('99 more videos')).toBeInTheDocument()
  })

  it('renders the creator profile with their courses', () => {
    renderApp('/creators/purepearl-studio')
    expect(screen.getByRole('heading', { level: 1, name: 'PurePearl Studio' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Follow' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('heading', { name: courses[0].title })).toBeInTheDocument()
  })
})

describe('creator route state', () => {
  it('resets follow state when navigating to another creator', async () => {
    const user = userEvent.setup()
    renderApp('/creators/nova-labs')
    await user.click(screen.getByRole('button', { name: 'Follow' }))
    expect(screen.getByRole('button', { name: 'Following' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Creators' }))
    expect(screen.getByRole('heading', { level: 1, name: 'PurePearl Studio' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Follow' })).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('search page', () => {
  beforeEach(() => {
    vi.mocked(window.scrollTo).mockClear()
  })

  it('syncs the search box with ?q and applies it', () => {
    renderApp('/search?q=figma')
    expect(screen.getByRole('searchbox', { name: /search courses/i })).toHaveValue('figma')
    const results = screen.getAllByRole('article')
    expect(results.length).toBeGreaterThan(0)
    expect(results.length).toBeLessThan(courses.length)
  })

  it('filters with the quick category chips and clears with Featured', async () => {
    const user = userEvent.setup()
    renderApp('/search')
    const group = screen.getByRole('group', { name: /quick category filters/i })
    const all = screen.getAllByRole('article').length

    await user.click(within(group).getByRole('button', { name: 'Music' }))
    expect(within(group).getByRole('button', { name: 'Music' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('article')).toHaveLength(courses.filter((course) => course.categories.includes('Music')).length)

    await user.click(within(group).getByRole('button', { name: 'Featured' }))
    expect(screen.getAllByRole('article')).toHaveLength(all)
  })

  it('sorts by price and shows the real page count', async () => {
    const user = userEvent.setup()
    renderApp('/search')
    await user.selectOptions(screen.getByRole('combobox', { name: /sort results/i }), 'Price: low to high')
    const prices = [...document.querySelectorAll('.course-card__price strong')].map((node) =>
      Number(node.textContent?.replace(/[^0-9.]/g, '')),
    )
    expect(prices.length).toBeGreaterThan(5)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))

    const pager = screen.getByRole('navigation', { name: /search result pages/i })
    expect(within(pager).getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(within(pager).getByRole('button', { name: 'Next page' })).toBeEnabled()
    expect(within(pager).getAllByRole('button', { name: /^\d+$/ })).toHaveLength(5)
    expect(within(pager).getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')
  })

  it('opens and closes the search scope menu', async () => {
    const user = userEvent.setup()
    renderApp('/search')
    const trigger = screen.getByRole('button', { name: /search in/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menuitemradio', { name: 'Courses' })).toBeChecked()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await user.click(trigger)
    await user.click(screen.getByRole('menuitemradio', { name: 'Courses' }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

describe('auth routes', () => {
  it('blocks signup until the fields are valid, then shows demo-only feedback', async () => {
    const user = userEvent.setup()
    renderApp('/signup')

    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText(/enter your full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-invalid', 'true')

    await user.type(screen.getByLabelText(/full name/i), 'Jamie Davis')
    await user.type(screen.getByLabelText('Email'), 'jamie@example.com')
    await user.type(screen.getByLabelText('Password'), 'longpassword')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(screen.getByRole('heading', { name: /you’re on your way/i })).toBeInTheDocument()
    expect(screen.getByText(/no account was created and no credentials were sent anywhere/i)).toBeInTheDocument()
  })

  it('rejects an invalid email address inline', async () => {
    const user = userEvent.setup()
    renderApp('/login')

    await user.type(screen.getByLabelText(/^email$/i), 'not-an-email')
    await user.type(screen.getByLabelText(/^password$/i), 'learning123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument()
  })

  it('signs in with valid credentials and offers social placeholders', async () => {
    const user = userEvent.setup()
    renderApp('/login')

    expect(screen.getByRole('button', { name: /continue with facebook/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/^email$/i), 'learner@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'learning123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByRole('heading', { name: /you’re signed in/i })).toBeInTheDocument()
  })

  it('does not carry form state between /login and /signup', async () => {
    const user = userEvent.setup()
    renderApp('/login')

    await user.type(screen.getByLabelText(/^email$/i), 'learner@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'learning123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByRole('heading', { name: /you’re signed in/i })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /create an account|sign up/i }))
    expect(screen.queryByRole('heading', { name: /on your way/i })).not.toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
  })

  it('clears validation errors when switching routes', async () => {
    const user = userEvent.setup()
    renderApp('/login')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /create an account|sign up/i }))
    expect(screen.queryByText(/enter a valid email address/i)).not.toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderApp('/login')
    await user.click(screen.getByRole('button', { name: /show password/i }))
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('type', 'text')
  })
})

describe('not found route', () => {
  it('renders the design copy with a working home link', () => {
    renderApp('/not-a-route')
    expect(screen.getByRole('heading', { name: /page you are looking for doesn’t exist/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/')
  })
})
