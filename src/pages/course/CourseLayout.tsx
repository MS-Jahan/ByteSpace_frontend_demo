import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import { Icon } from '../../components/Icons'
import { usePageTitle } from '../../usePageTitle'
import { NotFoundPage } from '../NotFoundPage'
import { courseIncludes, curriculumFor, findCourse, findCreator, formatPrice } from '../../data'

const PITCH = 'Ready to Dive In? Enroll Now and Start Building Your Digital Future!'

/** Web Share where the browser has it, otherwise copy the link. Returns a status line. */
async function shareCourse(title: string) {
  const url = window.location.href
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, url })
      return 'Shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return ''
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    return 'Link copied'
  } catch {
    return 'Copy the address bar link to share'
  }
}

export function CourseLayout() {
  const { slug } = useParams()
  const course = findCourse(slug)
  const creator = findCreator(course?.creatorSlug)
  const { pathname } = useLocation()
  const tab = pathname.endsWith('/lessons') ? 'Lessons' : pathname.endsWith('/reviews') ? 'Reviews' : ''
  usePageTitle(course ? [course.details.fullTitle, tab].filter(Boolean).join(' \u2013 ') : 'Page not found')
  const [shareStatus, setShareStatus] = useState('')
  const [videoNotice, setVideoNotice] = useState('')
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  function flash(setter: (text: string) => void, text: string) {
    setter(text)
    timers.current.push(window.setTimeout(() => setter(''), 4000))
  }

  async function handleShare() {
    if (course) flash(setShareStatus, await shareCourse(course.details.fullTitle))
  }

  function handlePlay() {
    flash(setVideoNotice, 'Demo only \u2014 video playback is not available in this prototype.')
  }

  if (!course || !creator) return <NotFoundPage />

  const { details } = course
  const { preview, moreVideos } = curriculumFor(details)

  return (
    <div className={`course-page course-page--${tab.toLowerCase() || 'about'}`}>
      <div className="course-page__band" aria-hidden="true">
        <div className="grid-overlay" />
      </div>

      <div className="container course-page__grid">
        <div className="course-page__main">
          <div className="course-hero">
            <div className="grid-overlay" aria-hidden="true" />
            <h1>{details.fullTitle}</h1>
            <p className="course-hero__subtitle">{details.subtitle}</p>
            <p className="course-hero__instructor">
              by <Link to={`/creators/${course.creatorSlug}`}>{course.instructor}</Link>
            </p>
            <ul className="course-hero__meta">
              <li>
                <Icon name="level" /> {details.level}
              </li>
              <li>
                <Icon name="starRate" /> {details.rating.toFixed(1)} ({details.reviewCount} reviews)
              </li>
              <li>
                <Icon name="people" /> {details.students} Students
              </li>
            </ul>
            <div className="course-page__share">
              <button
                className="button button--lime button--sm"
                type="button"
                onClick={handleShare}
              >
                <Icon name="share" /> Share
              </button>
              <p role="status">{shareStatus}</p>
            </div>
            <div className="course-video">
              <img src={details.video.src} alt={details.video.alt} />
              {/* The poster artwork carries the visible play button; this
                  chrome-less control sits exactly over it, so the page shows
                  one play affordance, not two. */}
              <button
                className="course-video__play"
                type="button"
                aria-label={`Play the ${details.fullTitle} preview`}
                onClick={handlePlay}
              />
              <p className="course-video__notice" role="status">
                {videoNotice}
              </p>
            </div>
          </div>

          <div className="course-tabs">
            <NavLink to={`/courses/${course.slug}`} end>
              About
            </NavLink>
            <NavLink to={`/courses/${course.slug}/lessons`}>Lessons</NavLink>
            <NavLink to={`/courses/${course.slug}/reviews`}>Reviews</NavLink>
          </div>

          <Outlet key={course.slug} context={course} />
        </div>

        <aside className="course-sidebar" aria-label="Course enrolment">
          <h2>
            {details.totalLessons} Lessons ({details.totalDuration})
          </h2>
          <ol className="lesson-preview">
            {preview.map((lesson) => (
              <li key={lesson.number}>
                <span className="lesson-preview__number">{lesson.number}</span>
                <span className="lesson-preview__title">{lesson.title}</span>
                <span className="lesson-preview__duration">{lesson.duration}</span>
              </li>
            ))}
          </ol>
          <p className="lesson-preview__more">{moreVideos} more {moreVideos === 1 ? 'video' : 'videos'}</p>
          <p className="course-sidebar__pitch">{PITCH}</p>
          <p className="course-sidebar__price">
            <strong>{formatPrice(course.price)}</strong>
            <span>/lifetime</span>
          </p>
          <Link className="button button--lime course-sidebar__enroll" to="/signup">
            Enroll Now
          </Link>
          <h2 className="course-sidebar__includes">This course include</h2>
          <ul className="include-list">
            {courseIncludes.map((item) => (
              <li key={item.label}>
                <Icon name={item.icon} /> {item.label}
              </li>
            ))}
          </ul>
          <div className="course-sidebar__author">
            <img src={creator.sidebarAvatar ?? creator.avatar} alt="" />
            <div>
              <strong>{creator.name}</strong>
              <small>{creator.role}</small>
            </div>
          </div>
          <p className="course-sidebar__pitch">{PITCH}</p>
          <Link
            className="button button--outline button--sm course-sidebar__profile"
            to={`/creators/${course.creatorSlug}`}
          >
            See Full Profile
          </Link>
        </aside>
      </div>
    </div>
  )
}
