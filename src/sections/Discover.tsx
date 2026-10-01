import { useMemo, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { CourseCard } from '../components/CourseCard'
import { courseFilters, courseHasCategory, courses, landingCourses } from '../data'

const LANDING_GRID_SIZE = 6
/** The design breaks the pills into rows of 8, 6 and the rest on desktop. */
const FILTER_LINES = [courseFilters.slice(0, 8), courseFilters.slice(8, 14), courseFilters.slice(14)]

export function Discover() {
  const [activeFilter, setActiveFilter] = useState('Featured')

  function selectFilter(event: MouseEvent<HTMLButtonElement>) {
    setActiveFilter(event.currentTarget.dataset.filter ?? 'Featured')
  }

  const visibleCourses = useMemo(() => {
    if (activeFilter === 'Featured') return landingCourses
    // The grid is two rows of three, as in the design.
    return courses.filter((course) => courseHasCategory(course, activeFilter)).slice(0, LANDING_GRID_SIZE)
  }, [activeFilter])

  return (
    <section className="section discover" id="courses">
      <div className="container">
        <header className="section-heading section-heading--center">
          <h2>Discover Your Passion, Build Your Skills</h2>
          <p>
            At Bytespace Courses, we bring you closer to life-changing knowledge. Explore a variety of courses across
            different fields, from technology to the arts, and make a difference in your career and life.
          </p>
        </header>

        <div className="filter-row" role="group" aria-label="Filter courses by category">
          {FILTER_LINES.map((line, index) => (
            <div className="filter-row__line" key={line[0]}>
              {line.map((filter) => (
                <button
                  className={`filter-pill${activeFilter === filter ? ' filter-pill--active' : ''}`}
                  type="button"
                  key={filter}
                  aria-pressed={activeFilter === filter}
                  data-filter={filter}
                  onClick={selectFilter}
                >
                  {filter}
                </button>
              ))}
              {index === FILTER_LINES.length - 1 && (
                <Link className="filter-pill filter-pill--more" to="/search">
                  + More
                </Link>
              )}
            </div>
          ))}
        </div>

        {visibleCourses.length > 0 ? (
          <div className="course-grid">
            {visibleCourses.map((course) => (
              <CourseCard course={course} key={course.slug} />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No courses in this category yet. Pick &ldquo;Featured&rdquo; to see everything, or{' '}
            <Link to="/search">search the full catalogue</Link>.
          </p>
        )}
      </div>
    </section>
  )
}
