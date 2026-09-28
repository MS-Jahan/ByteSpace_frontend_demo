import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Brand } from './Brand'
import { Icon } from './Icons'

export function Footer() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Thanks for your interest — this demo did not send or save your email.')
    setEmail('')
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-newsletter">
            <Brand />
            <p>Stay up to date with fresh ideas, new courses, and all things ByteSpace.</p>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <Icon name="mail" />
              <input
                id="newsletter-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button className="button button--lime button--small" type="submit">Subscribe</button>
            </form>
            <p className={`newsletter-message${message ? ' newsletter-message--visible' : ''}`} aria-live="polite">{message || 'By subscribing, you agree to our Privacy Policy.'}</p>
          </div>
          <div className="footer-links">
            <div><h3>Explore</h3><a href="#courses">Featured courses</a><a href="#categories">Categories</a><a href="#stories">Learner stories</a></div>
            <div><h3>Learn</h3><a href="#courses">Design</a><a href="#courses">Development</a><a href="#courses">Business</a></div>
            <div><h3>Join ByteSpace</h3><Link to="/signup">Become a creator</Link><Link to="/signup">Create an account</Link><Link to="/login">Log in</Link></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} ByteSpace. Learn without limits.</span><div><a href="#courses">Explore courses</a><a href="#creators">For creators</a><a href="#home">Back to top</a></div></div>
      </div>
    </footer>
  )
}
