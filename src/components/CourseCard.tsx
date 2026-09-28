import { useState } from 'react'
import type { Course } from '../data'
import { Icon } from './Icons'

export function CourseCard({ course }: { course: Course }) {
  const [saved, setSaved] = useState(false)

  return (
    <article className="course-card">
      <div className="course-card__image-wrap" style={{ backgroundColor: course.accent }}>
        <img className="course-card__image" src={course.image} alt="" loading="lazy" />
        <span className="course-card__category">{course.category}</span>
        <button className="course-card__save" type="button" aria-label={`${saved ? 'Remove saved' : 'Save'} ${course.title}`} aria-pressed={saved} onClick={() => setSaved((current) => !current)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.8L6 21V4.75Z" /></svg>
        </button>
      </div>
      <div className="course-card__content">
        <div className="course-card__meta"><span>{course.level}</span><span>{course.lessons}</span></div>
        <h3>{course.title}</h3>
        <p className="course-card__teacher"><span className="course-card__initials">{course.initials}</span> By {course.instructor}</p>
        <div className="course-card__bottom">
          <span className="course-card__rating"><Icon name="star" /> {course.rating} <span>({course.reviews})</span></span>
          <strong>{course.price}</strong>
        </div>
      </div>
    </article>
  )
}
