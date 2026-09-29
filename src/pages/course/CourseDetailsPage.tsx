import { useOutletContext } from 'react-router-dom'
import { Icon } from '../../components/Icons'
import type { Course } from '../../data'

export function CourseDetailsPage() {
  const { details } = useOutletContext<Course>()

  return (
    <div className="course-tab">
      <h2>Description</h2>
      {details.description.map((paragraph) => (
        <p className="body-copy" key={paragraph}>
          {paragraph}
        </p>
      ))}

      <h2>Sneak Peak</h2>
      <ul className="sneak-peek">
        {details.sneakPeek.map((image) => (
          <li key={image.src}>
            <img src={image.src} alt={image.alt} loading="lazy" />
          </li>
        ))}
      </ul>

      <h2>Key Points</h2>
      <ul className="key-points">
        {details.keyPoints.map((point) => (
          <li key={point}>
            <Icon name="verified" /> {point}
          </li>
        ))}
      </ul>
    </div>
  )
}
