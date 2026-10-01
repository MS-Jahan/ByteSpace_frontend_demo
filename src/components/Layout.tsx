import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

/** The course tabs (`/courses/:slug`, `/lessons`, `/reviews`) share one scroll position. */
function scrollKey(pathname: string) {
  const course = /^\/courses\/([^/]+)/.exec(pathname)
  return course ? `course:${course[1]}` : pathname
}

/**
 * - Hash links scroll to their target (the header offset comes from `scroll-padding-top`).
 * - Back/Forward keep the browser's own restored position.
 * - Switching tabs inside one course keeps the position.
 * - Any other navigation starts at the top. Resets are instant despite `scroll-behavior: smooth`.
 * The hash target may land a few frames late when a route has only just mounted.
 */
function useScrollBehaviour() {
  const { hash, pathname } = useLocation()
  const navigationType = useNavigationType()
  const previousKey = useRef<string | null>(null)

  useEffect(() => {
    const key = scrollKey(pathname)
    const sameView = previousKey.current === key
    previousKey.current = key

    if (!hash) {
      if (navigationType !== 'POP' && !sameView) window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    let cancelled = false
    let attempts = 0

    const jump = () => {
      if (cancelled) return
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }
      if (attempts < 10) {
        attempts += 1
        window.requestAnimationFrame(jump)
      }
    }

    jump()
    return () => {
      cancelled = true
    }
  }, [hash, pathname, navigationType])
}

export function Layout() {
  useScrollBehaviour()

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
