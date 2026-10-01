import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Course } from '../data'
import { formatPrice } from '../data'
import { AvatarStack } from './AvatarStack'
import { Icon } from './Icons'

type CourseCardProps = {
  course: Course
  /**
   * Purely visual copy (the Growth section and auth collage): inert, hidden from
   * assistive technology and without links.
   */
  decorative?: boolean
}

export function CourseCard({ course, decorative = false }: CourseCardProps) {
  const link = (to: string, children: ReactNode, props: { tabIndex?: number; 'aria-hidden'?: true } = {}) =>
    decorative ? <span>{children}</span> : <Link to={to} {...props}>{children}</Link>
  const courseUrl = `/courses/${course.slug}`

  return (
    <article className={`course-card${decorative ? ' course-card--decorative' : ''}`} aria-hidden={decorative || undefined} inert={decorative || undefined}>
      <div className="course-card__media">
        {link(courseUrl, <img className="course-card__image" src={course.image} alt="" loading="lazy" />, {
          tabIndex: -1,
          'aria-hidden': true,
        })}
        <span className="course-card__pills">
          <span>{course.lessons} Lessons</span>
          <span>{course.duration}</span>
          <span>{course.comments} Comments</span>
        </span>
      </div>
      <div className="course-card__body">
        <div className="course-card__title-row">
          <h3 title={course.title}>{link(courseUrl, course.title)}</h3>
          <span className="course-card__rating">
            {course.rating.toFixed(1)} <Icon name="star" />
            <span className="sr-only">out of 5 from {course.details.reviewCount} reviews</span>
          </span>
        </div>
        <p className="course-card__teacher">by {link(`/creators/${course.creatorSlug}`, course.instructor)}</p>
        <div className="course-card__footer">
          <span className="course-card__level">
            <Icon name="level" /> {course.level}
          </span>
          <AvatarStack />
        </div>
        <p className="course-card__price">
          <strong>{formatPrice(course.price)}</strong>
          <span>/lifetime</span>
        </p>
      </div>
    </article>
  )
}
