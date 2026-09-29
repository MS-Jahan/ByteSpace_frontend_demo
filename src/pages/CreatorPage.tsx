import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CourseCard } from '../components/CourseCard'
import { CourseToolbar } from '../components/CourseToolbar'
import { courseHasCategory, courses, findCreator, type Creator } from '../data'
import { usePageTitle } from '../usePageTitle'
import { NotFoundPage } from './NotFoundPage'
import { CATEGORY_LABEL, LEVEL_LABEL, sortCourses, sorts } from '../courseFilters'

/** Keys the profile by slug so follow and filter state never carries over between creators. */
export function CreatorRoute() {
  const { slug } = useParams()
  const creator = findCreator(slug)
  return creator ? <CreatorPage key={creator.slug} creator={creator} /> : <NotFoundPage />
}

function CreatorPage({ creator }: { creator: Creator }) {
  usePageTitle(creator.name)
  const slug = creator.slug
  const [following, setFollowing] = useState(false)
  const [category, setCategory] = useState(CATEGORY_LABEL)
  const [level, setLevel] = useState(LEVEL_LABEL)
  const [featured, setFeatured] = useState(false)
  const [sort, setSort] = useState(sorts[0])

  const creatorCourses = useMemo(() => courses.filter((course) => course.creatorSlug === slug), [slug])

  const visibleCourses = useMemo(() => {
    const filtered = creatorCourses.filter((course) => {
      const matchesCategory = category === CATEGORY_LABEL || courseHasCategory(course, category)
      const matchesLevel = level === LEVEL_LABEL || course.level === level
      return matchesCategory && matchesLevel && (!featured || course.rating >= 4.5)
    })
    return sortCourses(filtered, sort)
  }, [creatorCourses, category, level, featured, sort])

  function toggleFollow() {
    setFollowing((current) => !current)
  }

  const categories = [...new Set(creatorCourses.flatMap((course) => course.categories))]

  return (
    <>
      <section className="creator-hero">
        <div className="grid-overlay" aria-hidden="true" />
        <div className="container creator-hero__content">
          <div className="creator-hero__identity">
            <img src={creator.avatar} alt="" />
            <div>
              <div className="creator-hero__title">
                <h1 className="creator-hero__name">{creator.name}</h1>
                <span className="creator-hero__badge">Creator</span>
              </div>
              <p className="creator-hero__tagline">{creator.tagline}</p>
            </div>
          </div>
          <div className="creator-hero__bio">
            {creator.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="creator-hero__footer">
            <p className="creator-hero__stats">
              <span>
                <strong>{creator.products}</strong> Products
              </span>
              <span>
                <strong>{creator.followers}</strong> Followers
              </span>
            </p>
            <button
              className="button button--lime"
              type="button"
              aria-pressed={following}
              onClick={toggleFollow}
            >
              {following ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </section>

      <section className="section search-results creator-page-results">
        <div className="container">
          <CourseToolbar
            featured={featured}
            onFeatured={setFeatured}
            level={level}
            onLevel={setLevel}
            categories={categories}
            category={category}
            onCategory={setCategory}
            sort={sort}
            onSort={setSort}
          />

          <p className="sr-only" role="status">
            {visibleCourses.length} {visibleCourses.length === 1 ? 'course' : 'courses'}
          </p>

          <div className="course-grid">
            {visibleCourses.map((course) => (
              <CourseCard course={course} key={course.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
