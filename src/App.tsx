import { useMemo, useState, type FormEvent } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { Brand } from './components/Brand'
import { CourseCard } from './components/CourseCard'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Icon } from './components/Icons'
import { categories, courses, testimonials } from './data'

function scrollToCourses() {
  const coursesSection = document.getElementById('courses')
  if (typeof coursesSection?.scrollIntoView === 'function') {
    coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function HomePage() {
  const [searchDraft, setSearchDraft] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All courses')
  const [showAllCourses, setShowAllCourses] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesCategory = activeCategory === 'All courses' || course.category === activeCategory
      const matchesQuery = !query || [course.title, course.category, course.instructor].some((value) => value.toLowerCase().includes(query))
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, searchQuery])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearchQuery(searchDraft)
    setActiveCategory('All courses')
    scrollToCourses()
  }

  return (
    <>
      <main>
        <section className="hero" id="home">
          <div className="hero__grid" aria-hidden="true" />
          <div className="hero__orbit hero__orbit--one" aria-hidden="true" />
          <div className="hero__orbit hero__orbit--two" aria-hidden="true" />
          <Header />
          <div className="container hero__content">
            <p className="eyebrow eyebrow--lime"><span className="eyebrow__sparkle"><Icon name="sparkle" /></span> A little space for a lot of growth</p>
            <h1>Get access to <span>hundreds</span> of courses available</h1>
            <p className="hero__intro">Unlock your creativity, gain valuable knowledge, and grow your business with our wide range of courses.</p>
            <form className="hero-search" role="search" onSubmit={handleSearch}>
              <Icon name="search" />
              <label className="sr-only" htmlFor="course-search">Search courses, topics, or creators</label>
              <input
                id="course-search"
                name="search"
                type="search"
                placeholder="Course, topic, creator"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
              />
              <button className="button button--lime" type="submit">Search <Icon name="arrow" /></button>
            </form>
            <div className="hero__popular"><span>Popular:</span><button type="button" onClick={() => { setSearchDraft('Design'); setSearchQuery('Design'); scrollToCourses() }}>Design</button><button type="button" onClick={() => { setSearchDraft('Development'); setSearchQuery('Development'); scrollToCourses() }}>Development</button><button type="button" onClick={() => { setSearchDraft('Marketing'); setSearchQuery('Marketing'); scrollToCourses() }}>Marketing</button></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <img src="/assets/home-image-15c3a6ff74.png" alt="" />
            <div className="hero-note hero-note--students"><div className="avatar-stack"><span>J</span><span>M</span><span>S</span></div><div><strong>12K+</strong><small>happy learners</small></div></div>
            <div className="hero-note hero-note--rating"><span className="hero-note__star"><Icon name="star" /></span><div><strong>4.9/5</strong><small>learner rating</small></div></div>
          </div>
          <a className="hero-scroll" href="#partners"><span /> Scroll to explore</a>
        </section>

        <section className="partner-strip" id="partners" aria-label="Partners and creative tools">
          <div className="container partner-strip__inner">
            <p>Helping curious minds grow at every stage</p>
            <div className="partner-logos" aria-label="Creative tools"><span className="partner-logo partner-logo--serif">notion</span><span className="partner-logo partner-logo--bold">adobe</span><span className="partner-logo partner-logo--mono">Webflow</span><span className="partner-logo partner-logo--wide">slack</span><span className="partner-logo partner-logo--rounded">Figma</span></div>
          </div>
        </section>

        <section className="section categories-section" id="categories">
          <div className="container">
            <div className="section-heading section-heading--split">
              <div><p className="eyebrow">A world of ideas</p><h2>Innovative paths<br className="desktop-break" /> to knowledge.</h2></div>
              <p className="section-heading__copy">Find your next big idea in thoughtfully made courses, taught by people who love what they do.</p>
            </div>
            <div className="category-grid">
              {categories.slice(1).map((category, index) => (
                <a className={`category-tile category-tile--${index + 1}`} href="#courses" key={category.name} onClick={() => setActiveCategory(category.name)}>
                  <span className="category-tile__icon" aria-hidden="true">{category.icon}</span>
                  <span className="category-tile__text"><strong>{category.name}</strong><small>{category.count} courses</small></span>
                  <span className="category-tile__arrow"><Icon name="arrow" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section courses-section" id="courses">
          <div className="container">
            <div className="section-heading section-heading--center">
              <p className="eyebrow">Handpicked for you</p>
              <h2>Discover your passion,<br className="desktop-break" /> build your skills.</h2>
              <p>Explore a variety of courses across different fields, from technology to the arts, and make a difference in your career and life.</p>
            </div>
            <div className="course-toolbar">
              <div className="category-pills" role="group" aria-label="Filter courses by category">
                {categories.slice(0, 6).map((category) => (
                  <button className={`category-pill${activeCategory === category.name ? ' category-pill--active' : ''}`} type="button" key={category.name} aria-pressed={activeCategory === category.name} onClick={() => { setActiveCategory(category.name); setSearchQuery(''); setSearchDraft('') }}>{category.name}</button>
                ))}
              </div>
              <span className="course-count">{filteredCourses.length} courses</span>
            </div>
            {filteredCourses.length > 0 ? (
              <div className="course-grid">
                {(showAllCourses ? filteredCourses : filteredCourses.slice(0, 6)).map((course) => <CourseCard course={course} key={course.title} />)}
              </div>
            ) : (
              <div className="empty-state"><span className="empty-state__icon"><Icon name="search" /></span><h3>No courses found</h3><p>Try another search or choose a different category.</p><button className="button button--outline" type="button" onClick={() => { setSearchDraft(''); setSearchQuery(''); setActiveCategory('All courses') }}>Clear filters</button></div>
            )}
            {!showAllCourses && filteredCourses.length > 3 && <button className="button button--outline courses-more" type="button" onClick={() => setShowAllCourses(true)}>View all courses <Icon name="arrow" /></button>}
          </div>
        </section>

        <section className="section growth-section" id="about">
          <div className="container growth-layout">
            <div className="growth-copy">
              <p className="eyebrow">Your next chapter starts here</p>
              <h2>Your path to professional growth starts here.</h2>
              <p className="body-copy">Explore our curated selection of courses designed to enhance your capabilities and accelerate your career journey. Find the skills to sharpen, the expertise to build, and the next path to follow.</p>
              <div className="growth-stats"><div><strong>12K<span>+</span></strong><small>Students</small></div><div><strong>70<span>+</span></strong><small>Courses</small></div><div><strong>16</strong><small>Creators</small></div></div>
              <a className="text-link" href="#courses">Find your next course <Icon name="arrow" /></a>
            </div>
            <div className="growth-art">
              <div className="growth-glow" aria-hidden="true" />
              <article className="learning-card">
                <img src="/assets/home-image-7be5f04241.png" alt="Learner joining a live class" loading="lazy" />
                <div className="learning-card__content"><span className="live-dot">Live class</span><strong>Design thinking<br />for tomorrow</strong><small>with Nora Mitchell</small><div className="progress-line"><span /></div><small>Lesson 04 <b>of 12</b></small></div>
              </article>
              <div className="growth-float growth-float--success"><span><Icon name="check" /></span><div><strong>New skill unlocked</strong><small>Keep up the great work</small></div></div>
              <div className="growth-float growth-float--community"><div className="avatar-stack"><span>A</span><span>J</span><span>K</span></div><strong>Learning together</strong><small>makes it stick</small></div>
            </div>
          </div>
        </section>

        <section className="section creator-section" id="creators">
          <div className="container creator-layout">
            <div className="creator-art">
              <div className="creator-art__shape creator-art__shape--lime" aria-hidden="true" />
              <div className="creator-art__shape creator-art__shape--blue" aria-hidden="true" />
              <img src="/assets/home-image-eb157cb563.png" alt="Course creator presenting a lesson" loading="lazy" />
              <div className="creator-sticker"><Icon name="sparkle" /><span>Your knowledge<br />has a home.</span></div>
            </div>
            <div className="creator-copy">
              <p className="eyebrow">Made for the makers</p>
              <h2>Create &amp; manage courses easily.</h2>
              <p className="body-copy"><strong>ByteSpace</strong> supports people and teams in creating, publishing, and sharing courses with a curious community.</p>
              <ul className="check-list"><li><span><Icon name="check" /></span> Share your expertise</li><li><span><Icon name="check" /></span> Monetize your passion</li><li><span><Icon name="check" /></span> Work on your own schedule</li><li><span><Icon name="check" /></span> Build a community that cares</li></ul>
              <Link className="button button--primary" to="/signup">Start creating <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>

        <section className="creator-cta">
          <div className="hero__grid" aria-hidden="true" />
          <div className="creator-cta__rings" aria-hidden="true" />
          <div className="container creator-cta__content">
            <p className="eyebrow eyebrow--lime">Your voice belongs here</p>
            <h2>Unlock your potential<br className="desktop-break" /> as a creator.</h2>
            <p>Join a community of curious minds. Use our course tools to share your expertise, grow your audience, and make learning more human.</p>
            <Link className="button button--lime" to="/signup">Join as a creator <Icon name="arrow" /></Link>
          </div>
          <span className="creator-cta__star" aria-hidden="true">✳</span>
        </section>

        <section className="section testimonials-section" id="stories">
          <div className="container">
            <div className="testimonials-heading">
              <div><p className="eyebrow">Good things are growing</p><h2>Discover what our<br className="desktop-break" /> community is saying.</h2></div>
              <p>Learning changes everything. Hear from people who found their next step, their spark, and their space at ByteSpace.</p>
            </div>
            <div className="testimonial-grid">
              {testimonials.map((testimonial, index) => (
                <article className={`testimonial-card${activeTestimonial === index ? ' testimonial-card--active' : ''}`} key={testimonial.name}>
                  <div className="testimonial-card__top"><div className="testimonial-person"><img src={testimonial.avatar} alt="" loading="lazy" /><div><strong>{testimonial.name}</strong><small>{testimonial.role}</small></div></div><span className="quote-mark">“</span></div>
                  <p>“{testimonial.quote}”</p>
                  <div className="testimonial-stars" aria-label="5 out of 5 stars"><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /></div>
                </article>
              ))}
            </div>
            <div className="testimonial-controls" aria-label="Choose featured testimonial">
              {testimonials.map((testimonial, index) => <button key={testimonial.name} type="button" aria-label={`Show testimonial from ${testimonial.name}`} aria-pressed={activeTestimonial === index} className={activeTestimonial === index ? 'is-active' : ''} onClick={() => setActiveTestimonial(index)} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

type AuthPageProps = { mode: 'login' | 'signup' }

function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [forgotMessage, setForgotMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="auth-page">
      <div className="auth-page__grid" aria-hidden="true" />
      <div className="auth-page__glow auth-page__glow--one" aria-hidden="true" />
      <div className="auth-page__glow auth-page__glow--two" aria-hidden="true" />
      <div className="auth-top container"><Brand light /><Link className="auth-back" to="/">Back to home <Icon name="arrow" /></Link></div>
      <div className="container auth-layout">
        <section className="auth-intro">
          <p className="eyebrow eyebrow--lime">{isSignup ? 'Your next chapter' : 'Welcome back'}</p>
          <h1>{isSignup ? <>Sign up<br />and come in.</> : <>Your space<br />to grow.</>}</h1>
          <p>{isSignup ? 'The registration process is simple, uncomplicated, and efficient — get started in a few quick steps, at no cost.' : 'A little more knowledge can take you a long way. Pick up right where your curiosity left off.'}</p>
          <div className="auth-proof"><div className="avatar-stack"><span>S</span><span>R</span><span>M</span></div><span>Join <strong>12,000+</strong> curious learners</span></div>
        </section>
        <section className="auth-card" aria-labelledby="auth-heading">
          <div className="auth-card__brand"><Brand /></div>
          <p className="eyebrow">{isSignup ? 'Create an account' : 'Good to see you again'}</p>
          <h2 id="auth-heading">{isSignup ? 'Welcome to ByteSpace' : 'Welcome back'}</h2>
          <p className="auth-card__description">{isSignup ? 'Start learning at your own pace.' : 'Sign in to continue learning.'}</p>
          {submitted ? (
            <div className="form-success" role="status"><span><Icon name="check" /></span><h3>{isSignup ? 'You’re on your way!' : 'You’re signed in!'}</h3><p>This is a demo experience — no account was created and no credentials were sent.</p><button className="button button--primary" type="button" onClick={() => navigate('/')}>Explore ByteSpace <Icon name="arrow" /></button></div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {isSignup && <div className="form-field"><label htmlFor="full-name">Full name</label><input id="full-name" name="name" type="text" placeholder="Jamie Davis" autoComplete="name" required /></div>}
              <div className="form-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" placeholder="designer@example.com" autoComplete="email" required /></div>
              <div className="form-field"><div className="form-field__label-row"><label htmlFor="password">Password</label>{!isSignup && <button className="forgot-link" type="button" onClick={() => setForgotMessage('Password reset is not connected in this demo.')}>Forgot password?</button>}</div><div className="password-wrap"><input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'} autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={8} required /><button className="password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((show) => !show)}><Icon name="eye" /></button></div></div>
              {isSignup && <label className="terms-check"><input type="checkbox" required /><span>I understand this is a demo and no account will be created.</span></label>}
              {forgotMessage && <p className="inline-message" role="status">{forgotMessage}</p>}
              <button className="button button--primary auth-submit" type="submit">{isSignup ? 'Continue' : 'Sign in'} <Icon name="arrow" /></button>
            </form>
          )}
          <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to ByteSpace?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Create an account'}</Link></p>
          <p className="auth-demo-note">Demo only · Your credentials are never stored.</p>
        </section>
      </div>
    </main>
  )
}

function NotFoundPage() {
  return <main className="not-found"><div className="not-found__grid" aria-hidden="true" /><Header /><div className="container not-found__content"><p className="not-found__code">404</p><p className="eyebrow eyebrow--lime">Wrong turn?</p><h1>The page you’re looking for doesn’t exist.</h1><p>Try a different address, or head back to ByteSpace and keep exploring.</p><Link className="button button--lime" to="/">Back to home <Icon name="arrow" /></Link></div></main>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
