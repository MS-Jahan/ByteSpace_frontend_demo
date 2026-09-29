import type { ChangeEvent } from 'react'
import { CATEGORY_LABEL, levels, sorts } from '../courseFilters'
import { Icon } from './Icons'

type CourseToolbarProps = {
  /** "Filter" toggles the featured (rating 4.5 and up) subset. */
  featured: boolean
  onFeatured: (next: boolean) => void
  level: string
  onLevel: (level: string) => void
  /** Category values without the leading "Category" label. */
  categories: string[]
  category: string
  onCategory: (category: string) => void
  sort: string
  onSort: (sort: string) => void
}

/** Filter, Level, Category and sort pills shared by the Search and Creator pages. */
export function CourseToolbar({
  featured,
  onFeatured,
  level,
  onLevel,
  categories,
  category,
  onCategory,
  sort,
  onSort,
}: CourseToolbarProps) {
  function toggleFeatured() {
    onFeatured(!featured)
  }

  function handleLevel(event: ChangeEvent<HTMLSelectElement>) {
    onLevel(event.target.value)
  }

  function handleCategory(event: ChangeEvent<HTMLSelectElement>) {
    onCategory(event.target.value)
  }

  function handleSort(event: ChangeEvent<HTMLSelectElement>) {
    onSort(event.target.value)
  }

  return (
    <div className="toolbar">
      <div className="toolbar__filters">
        <button
          className={`toolbar__button${featured ? ' toolbar__button--active' : ''}`}
          type="button"
          aria-pressed={featured}
          onClick={toggleFeatured}
        >
          <Icon name="filter" /> Filter
        </button>
        <label className="toolbar__select">
          <Icon name="level" />
          <span className="sr-only">Filter by level</span>
          <select value={level} onChange={handleLevel}>
            {levels.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="toolbar__select">
          <Icon name="shapes" />
          <span className="sr-only">Filter by category</span>
          <select value={category} onChange={handleCategory}>
            {[CATEGORY_LABEL, ...categories].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="toolbar__select toolbar__select--sort">
        <Icon name="sort" />
        <span className="sr-only">Sort results</span>
        <select value={sort} onChange={handleSort}>
          {sorts.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
