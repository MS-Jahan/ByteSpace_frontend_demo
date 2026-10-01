import { Link } from 'react-router-dom'
import { usePageTitle } from '../usePageTitle'

export function NotFoundPage() {
  usePageTitle('Page not found')
  return (
    <section className="not-found">
      <div className="grid-overlay" aria-hidden="true" />
      <div className="container not-found__content">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1>The page you are looking for doesn’t exist</h1>
        <p>Try to use a correct url or go back to homepage to start again</p>
        <Link className="button button--lime" to="/">
          Back to Home
        </Link>
      </div>
    </section>
  )
}
