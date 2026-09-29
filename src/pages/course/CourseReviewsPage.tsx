import { useMemo, useState, type MouseEvent } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Icon } from '../../components/Icons'
import { reviewsFor, type Course } from '../../data'

export function CourseReviewsPage() {
  const { details } = useOutletContext<Course>()
  const { rows, average, items, intro } = useMemo(() => reviewsFor(details), [details])
  const [activeStars, setActiveStars] = useState(0)

  function showAllRatings() {
    setActiveStars(0)
  }

  function filterByStars(event: MouseEvent<HTMLButtonElement>) {
    setActiveStars(Number(event.currentTarget.dataset.stars))
  }

  const visibleReviews = useMemo(
    () => (activeStars === 0 ? items : items.filter((review) => review.rating === activeStars)),
    [activeStars, items],
  )

  return (
    <div className="course-tab">
          <h2>What Learners Are Saying</h2>
          <p className="body-copy">{intro}</p>

          <div className="rating-summary">
            <div className="rating-summary__score">
              <small>Ratings</small>
              <strong>{average.toFixed(1)}</strong>
            </div>
            <ul className="rating-summary__rows">
              {rows.map((row) => (
                <li key={row.stars}>
                  <span className="rating-summary__track">
                    <span style={{ width: `${row.bar}%` }} />
                  </span>
                  <span className="rating-summary__stars" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Icon name="starRate" key={index} />
                    ))}
                  </span>
                  <span className="rating-summary__count">{row.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="reviews-heading">Individual Reviews:</h3>
          <div className="filter-row filter-row--tight" role="group" aria-label="Filter reviews by rating">
            <button
              className={`filter-pill${activeStars === 0 ? ' filter-pill--active' : ''}`}
              type="button"
              aria-pressed={activeStars === 0}
              onClick={showAllRatings}
            >
              All rating
            </button>
            {[5, 4, 3, 2, 1].map((stars) => (
              <button
                className={`filter-pill filter-pill--stars${activeStars === stars ? ' filter-pill--active' : ''}`}
                type="button"
                key={stars}
                aria-pressed={activeStars === stars}
                data-stars={stars}
                onClick={filterByStars}
              >
                <Icon name="starRate" /> {stars}
              </button>
            ))}
          </div>

          {visibleReviews.length > 0 ? (
            <ul className="review-list">
              {visibleReviews.map((review) => (
                <li className="review-card" key={review.name}>
                  <div className="review-card__top">
                    <img src={review.avatar} alt="" loading="eager" />
                    <div>
                      <strong>{review.name}</strong>
                      <small>{review.role}</small>
                    </div>
                    <span className="review-card__ago">{review.ago}</span>
                  </div>
                  <p className="review-card__stars" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }, (_, index) => (
                      <Icon name="starRate" key={index} />
                    ))}
                  </p>
                  <p className="review-card__quote">{review.quote}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No {activeStars}-star reviews yet.</p>
          )}
    </div>
  )
}
