import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Brand } from './Brand'
import { Icon } from './Icons'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/search' },
  { label: 'Creators', to: '/creators/purepearl-studio' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartNotice, setCartNotice] = useState('')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  function closeMenu() {
    setMenuOpen(false)
  }

  function toggleMenu() {
    setMenuOpen((open) => !open)
  }

  // The invented cart notice is a deliberate demo affordance (see docs/questions.md).
  function showCartNotice() {
    setCartNotice('Your cart is empty \u2014 this demo has no checkout.')
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand light />
        <button
          ref={toggleRef}
          className="icon-button site-header__toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
        <nav id="primary-navigation" className={`site-nav${menuOpen ? ' site-nav--open' : ''}`} aria-label="Main">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={closeMenu}>
              {item.label}
            </NavLink>
          ))}
          <div className="site-nav__mobile-auth">
            <Link to="/login" onClick={closeMenu}>
              Sign In
            </Link>
            <Link className="button button--lime button--small" to="/signup" onClick={closeMenu}>
              Join Us
            </Link>
            <button className="site-nav__cart" type="button" aria-label="Cart" onClick={showCartNotice}>
              <Icon name="bag" />
            </button>
          </div>
          <p className="site-nav__notice" role="status">
            {cartNotice}
          </p>
        </nav>
        <div className="site-header__actions">
          <Link className="site-header__signin" to="/login">
            Sign In
          </Link>
          <Link className="site-header__join" to="/signup">
            Join Us
          </Link>
          <button
            className="site-header__cart"
            type="button"
            aria-label="Cart"
            onClick={showCartNotice}
          >
            <Icon name="bag" />
          </button>
        </div>
      </div>
      <p className="site-header__notice" aria-live="polite">
        {cartNotice}
      </p>
    </header>
  )
}
