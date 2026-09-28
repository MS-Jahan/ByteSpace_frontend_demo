import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brand } from './Brand'
import { Icon } from './Icons'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand light />
        <button
          className="icon-button site-header__toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
        <nav id="primary-navigation" className={`site-nav${menuOpen ? ' site-nav--open' : ''}`} aria-label="Main navigation">
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#courses" onClick={() => setMenuOpen(false)}>Courses</a>
          <a href="#creators" onClick={() => setMenuOpen(false)}>Creators</a>
          <div className="site-nav__mobile-auth">
            <Link to="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link className="button button--lime button--small" to="/signup" onClick={() => setMenuOpen(false)}>Join us</Link>
          </div>
        </nav>
        <div className="site-header__actions">
          <Link className="site-header__signin" to="/login">Sign in</Link>
          <Link className="button button--lime button--small" to="/signup">Join us</Link>
        </div>
      </div>
    </header>
  )
}
