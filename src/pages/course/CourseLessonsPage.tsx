import { Icon } from '../../components/Icons'
import { ProgressLine } from '../../components/ProgressLine'
import { useOutletContext } from 'react-router-dom'
import { curriculumFor, learningProgress, type Course } from '../../data'

export function CourseLessonsPage() {
  const { details } = useOutletContext<Course>()
  const { modules } = curriculumFor(details)

  return (
    <div className="course-tab">
          <h2>Explore the Modules</h2>
          <p className="body-copy">
            Immerse yourself in the course content as we break down each module into comprehensive lessons, providing
            practical insights and hands-on experiences.
          </p>

          <h2>Lesson List</h2>
          <ul className="module-list">
            {modules.map((module) => (
              <li key={module.title}>
                <span className="module-list__icon" aria-hidden="true">
                  <Icon name="video" />
                </span>
                <div>
                  <strong>{module.title}</strong>
                  <p>{module.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <h2>Lesson Content</h2>
          <p className="body-copy">
            Engage with each lesson through captivating video content, detailed textual explanations, and interactive
            elements. Download resources, complete assignments, and test your understanding with quizzes.
          </p>

          <h2>Lesson Progress Tracking</h2>
          <p className="body-copy">
            Witness your growth as you complete lessons, with an intuitive progress tracking feature guiding you through
            your learning journey.
          </p>
          <div className="lesson-progress">
            <small>Learning Progress</small>
            <strong>{learningProgress}%</strong>
            <ProgressLine value={learningProgress} />
          </div>
    </div>
  )
}
