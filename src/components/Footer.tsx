import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Brand } from './Brand'
import { footerColumns } from '../data'
import { isValidEmail } from '../validation'

export function Footer() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    setError('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValidEmail(email)) {
      setMessage('')
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setMessage('Thanks for your interest \u2014 this demo did not send or save your email.')
    setEmail('')
  }

  return (
    <footer className="site-footer" id="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-newsletter">
            <Brand />
            <p>Stay Up to date with our latest features and releases by joining our newsletter.</p>
            <form className="newsletter-form" noValidate onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                autoComplete="email"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'newsletter-error' : undefined}
                onChange={handleEmailChange}
              />
              <button className="button button--lime" type="submit">
                Search
              </button>
            </form>
            {error && (
              <p className="field__error newsletter-error" id="newsletter-error" role="alert">
                {error}
              </p>
            )}
            <p className={`newsletter-message${message ? ' newsletter-message--sent' : ''}`} aria-live="polite">
              {message || 'By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.'}
            </p>
          </div>
          <div className="footer-links">
            {footerColumns.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h2 className="sr-only">{column.heading}</h2>
                {column.links.map((link) => (
                  <Link key={link.label} to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>@ 2023 ByteSpace. All rights reserved.</span>
          <div>
            <Link to="/legal#privacy">Privacy Policy</Link>
            <Link to="/legal#terms">Terms of Service</Link>
            <Link to="/legal#cookies">Cookies Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
