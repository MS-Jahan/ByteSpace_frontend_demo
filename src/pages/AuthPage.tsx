import { useState, type FormEvent, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { AvatarStack } from '../components/AvatarStack'
import { Brand } from '../components/Brand'
import { CourseCard } from '../components/CourseCard'
import { Icon } from '../components/Icons'
import { BakedShape } from '../components/Shape3D'
import { Stage } from '../components/Stage'
import { courses, happyStudentAvatars } from '../data'
import { usePageTitle } from '../usePageTitle'
import { isValidEmail } from '../validation'

/**
 * The auth collage in Figma pixels of the 1440 canvas. The stage origin sits at
 * frame (95, 280), so every offset below is the design position minus that.
 * Z-order follows the design (traced from the Figma export): the back card is
 * lowest, the lime pyramid and white squiggle overlap it, the front card sits
 * above those, the torus ring is fully visible over the front card, and the
 * students card is on top.
 */
const AUTH_ART = {
  pyramid: { x: 0.03, y: 421.6, w: 188.9, h: 188.9 },
  back: { x: 27, y: 114 },
  front: { x: 138, y: 25 },
  squiggle: { x: 375.8, y: 346, w: 175.8, h: 175.8 },
  torus: { x: 54.5, y: 39.7, w: 146.7, h: 146.7 },
  happy: { x: 253, y: 460 },
} as const

function AuthCollage() {
  return (
    <Stage width={560} height={611} className="auth__collage" decorative>
      <BakedShape
        className="auth__shape auth__shape--pyramid"
        src="/assets/shapes/login-auth-lime-pyramid.png"
        placement={AUTH_ART.pyramid}
      />
      <div className="auth__stack auth__stack--back" style={{ left: AUTH_ART.back.x, top: AUTH_ART.back.y }}>
        <CourseCard course={courses[1]} decorative />
      </div>
      <div className="auth__stack auth__stack--front" style={{ left: AUTH_ART.front.x, top: AUTH_ART.front.y }}>
        <CourseCard course={courses[2]} decorative />
      </div>
      <BakedShape
        className="auth__shape auth__shape--squiggle"
        src="/assets/shapes/login-auth-white-squiggle-b.png"
        placement={AUTH_ART.squiggle}
      />
      <BakedShape
        className="auth__shape auth__shape--torus"
        src="/assets/shapes/login-auth-lime-torus.png"
        placement={AUTH_ART.torus}
      />
      <div className="auth__happy" style={{ left: AUTH_ART.happy.x, top: AUTH_ART.happy.y }}>
        <strong>Happy Students</strong>
        <small>
          <b>4.5</b> <span>(240)</span> <Icon name="star" />
        </small>
        <AvatarStack avatars={happyStudentAvatars} count={2000} label="happy students" />
      </div>
    </Stage>
  )
}

type AuthPageProps = { mode: 'login' | 'signup' }

type Errors = { name?: string; email?: string; password?: string }

const copy = {
  login: {
    eyebrow: 'Sign in with ease',
    intro: 'Experience a seamless and efficient sign-in process that grants you instant access to a world of knowledge.',
    cardEyebrow: 'Sign In',
    cardTitle: 'Welcome Back',
    submit: 'Sign In',
    switchPrompt: 'New user?',
    switchLabel: 'Create an account',
    switchTo: '/signup',
  },
  signup: {
    eyebrow: 'Sign up and come in',
    intro:
      'The registration process is straightforward, uncomplicated, and efficient, allowing users to sign up quickly, easily, and at no cost',
    cardEyebrow: 'Create an Account',
    cardTitle: 'Welcome to ByteSpace',
    submit: 'Continue',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Login',
    switchTo: '/login',
  },
}

const socials = [
  { name: 'Facebook', icon: '/assets/icons/icon-facebook.svg' },
  { name: 'Google', icon: '/assets/icons/icon-google.svg' },
]

export function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === 'signup'
  const t = copy[mode]
  usePageTitle(isSignup ? 'Create your account' : 'Sign in')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [notice, setNotice] = useState('')

  function validate(form: HTMLFormElement) {
    const data = new FormData(form)
    const next: Errors = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')

    if (isSignup && name.length < 2) next.name = 'Enter your full name.'
    if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (password.length < 8) next.password = 'Use at least 8 characters.'
    return next
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const next = validate(form)
    setErrors(next)
    setNotice('')
    if (Object.keys(next).length > 0) {
      const firstField = form.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)
      firstField?.focus()
      return
    }
    setSubmitted(true)
  }

  function togglePassword() {
    setShowPassword((show) => !show)
  }

  function handleSocial(event: MouseEvent<HTMLButtonElement>) {
    setNotice(`Demo only \u2014 ${event.currentTarget.dataset.provider} sign-in is a visual placeholder.`)
  }

  return (
    <main className="auth">
      <div className="grid-overlay" aria-hidden="true" />
      <div className="auth__top container">
        <Brand light markOnly />
      </div>
      <div className="container auth__layout">
        <section className="auth__intro">
          <h1 className="auth__eyebrow">{t.eyebrow}</h1>
          <p className="auth__lede">{t.intro}</p>
          <AuthCollage />
        </section>

        <section className="auth__card" aria-labelledby="auth-heading">
          <p className="auth__card-eyebrow">{t.cardEyebrow}</p>
          <h2 id="auth-heading">{t.cardTitle}</h2>

          {submitted ? (
            <div className="auth__success" role="status">
              <span className="auth__success-icon">
                <Icon name="check" />
              </span>
              <h3>{isSignup ? 'You\u2019re on your way!' : 'You\u2019re signed in!'}</h3>
              <p>This is a demo experience — no account was created and no credentials were sent anywhere.</p>
              <Link className="button button--lime" to="/">
                Explore ByteSpace
              </Link>
            </div>
          ) : (
            <form className="auth__form" onSubmit={handleSubmit} noValidate>
              {isSignup && (
                <div className="field">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Jamie Davis"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p className="field__error" id="name-error">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="designer@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p className="field__error" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="field__wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    className="field__toggle"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={togglePassword}
                  >
                    <Icon name="eye" />
                  </button>
                </div>
                {errors.password && (
                  <p className="field__error" id="password-error">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="auth__actions">
                <button className="button button--lime" type="submit">
                  {t.submit}
                </button>
              </div>
              {!isSignup && (
                <>
                  <div className="auth__divider">
                    <span>or</span>
                  </div>
                  <div className="auth__social">
                    {socials.map((social) => (
                      <button
                        key={social.name}
                        className="auth__social-button"
                        type="button"
                        aria-label={`Continue with ${social.name}`}
                        data-provider={social.name}
                        onClick={handleSocial}
                      >
                        <img src={social.icon} alt="" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </form>
          )}

          {notice && (
            <p className="auth__notice" role="status">
              {notice}
            </p>
          )}
          <p className="auth__demo sr-only">
            Demo only · nothing is submitted, stored, or sent. Social sign-in is a visual placeholder.
          </p>

          <p className="auth__switch">
            {t.switchPrompt} <Link to={t.switchTo}>{t.switchLabel}</Link>
          </p>
        </section>
      </div>
    </main>
  )
}
