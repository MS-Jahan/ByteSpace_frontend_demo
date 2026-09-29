import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type MouseEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CourseCard } from '../components/CourseCard'
import { CourseToolbar } from '../components/CourseToolbar'
import { Icon } from '../components/Icons'
import { categories, courseFilters, courseHasCategory, courses } from '../data'
import { usePageTitle } from '../usePageTitle'
import { CATEGORY_LABEL, LEVEL_LABEL, sortCourses, sorts } from '../courseFilters'

/** The design's results page is six rows of three. */
const PAGE_SIZE = 18
/** The design's chip row: the first eight pills plus "Cooking". */
const chips = [...courseFilters.slice(0, 8), 'Cooking']

export function SearchPage() {
  usePageTitle('Find your next course')
  const [params, setParams] = useSearchParams()
  const [draft, setDraft] = useState(params.get('q') ?? '')
  const [scopeOpen, setScopeOpen] = useState(false)

  const query = params.get('q') ?? ''
  const level = params.get('level') ?? LEVEL_LABEL
  const category = params.get('category') ?? CATEGORY_LABEL
  const sort = params.get('sort') ?? sorts[0]
  const featuredOnly = params.get('featured') === '1'
  const page = Math.max(1, Number(params.get('page')) || 1)

  // The header's "Courses" link and the hero search both land here; keep the
  // input in step with the URL so the term is never stale.
  useEffect(() => {
    setDraft(query)
  }, [query])

  /** Any filter change resets to the first page. */
  function update(changes: Record<string, string | undefined>) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (!value) next.delete(key)
      else next.set(key, value)
    }
    next.delete('page')
    setParams(next, { replace: true })
  }

  /** Optional values fall back to the label that represents "no filter". */
  function updateFilter(key: string, value: string, fallback: string) {
    update({ [key]: value === fallback ? undefined : value })
  }

  function setPage(nextPage: number) {
    const next = new URLSearchParams(params)
    if (nextPage <= 1) next.delete('page')
    else next.set('page', String(nextPage))
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = courses.filter((course) => {
      const matchesQuery =
        !needle ||
        [course.title, ...course.categories, course.instructor, course.level].some((value) =>
          value.toLowerCase().includes(needle),
        )
      const matchesLevel = level === LEVEL_LABEL || course.level === level
      const matchesCategory = category === CATEGORY_LABEL || courseHasCategory(course, category)
      const matchesFeatured = !featuredOnly || course.rating >= 4.5
      return matchesQuery && matchesLevel && matchesCategory && matchesFeatured
    })

    return sortCourses(filtered, sort)
  }, [query, level, category, sort, featuredOnly])

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    update({ q: draft.trim() || undefined })
  }

  function handleDraftChange(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.target.value)
  }

  function toggleScope() {
    setScopeOpen((open) => !open)
  }

  function closeScope() {
    setScopeOpen(false)
  }

  function handleScopeKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') setScopeOpen(false)
  }

  function handleFeatured(next: boolean) {
    update({ featured: next ? '1' : undefined })
  }

  function handleLevel(value: string) {
    updateFilter('level', value, LEVEL_LABEL)
  }

  function handleCategory(value: string) {
    updateFilter('category', value, CATEGORY_LABEL)
  }

  function handleSort(value: string) {
    updateFilter('sort', value, sorts[0])
  }

  function handleChip(event: MouseEvent<HTMLButtonElement>) {
    const chip = event.currentTarget.dataset.chip
    update({ category: chip === 'Featured' ? undefined : chip })
  }

  function handlePageButton(event: MouseEvent<HTMLButtonElement>) {
    setPage(Number(event.currentTarget.dataset.page))
  }

  function goToPreviousPage() {
    setPage(currentPage - 1)
  }

  function goToNextPage() {
    setPage(currentPage + 1)
  }

  function clearFilters() {
    setParams(new URLSearchParams(), { replace: true })
    setDraft('')
  }

  return (
    <>
      <section className="search-hero">
        <div className="grid-overlay" aria-hidden="true" />
        <div className="container search-hero__content">
          <h1>Find Your Next Course</h1>
          <form className="hero-search" role="search" onSubmit={handleSearch}>
            <label className="sr-only" htmlFor="search-page-input">
              Search courses
            </label>
            <div className="hero-search__field">
              <Icon name="search" />
              <input
                id="search-page-input"
                name="search"
                type="search"
                placeholder="Search"
                value={draft}
                onChange={handleDraftChange}
              />
            </div>
            <div className="scope-menu">
              <button
                className="button button--lime button--scope"
                type="button"
                aria-haspopup="menu"
                aria-expanded={scopeOpen}
                onClick={toggleScope}
                onKeyDown={handleScopeKeyDown}
              >
                <span className="sr-only">Search in: </span>
                Courses <Icon name="chevron" />
              </button>
              {scopeOpen && (
                <ul className="scope-menu__list" role="menu">
                  <li role="none">
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked="true"
                      onClick={closeScope}
                      onKeyDown={handleScopeKeyDown}
                    >
                      Courses
                    </button>
                  </li>
                </ul>
              )}
            </div>
            <button className="sr-only" type="submit">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="section search-results">
        <div className="container">
          <CourseToolbar
            featured={featuredOnly}
            onFeatured={handleFeatured}
            level={level}
            onLevel={handleLevel}
            categories={categories}
            category={category}
            onCategory={handleCategory}
            sort={sort}
            onSort={handleSort}
          />

          <div className="filter-row filter-row--tight" role="group" aria-label="Quick category filters">
            {chips.map((chip) => {
              const isActive = chip === 'Featured' ? category === CATEGORY_LABEL : category === chip
              return (
                <button
                  className={`filter-pill${isActive ? ' filter-pill--active' : ''}`}
                  type="button"
                  key={chip}
                  aria-pressed={isActive}
                  data-chip={chip}
                  onClick={handleChip}
                >
                  {chip}
                </button>
              )
            })}
          </div>

          {/* Not in the design, but screen readers still need the count. */}
          <p className="sr-only" role="status">
            {results.length} {results.length === 1 ? 'course' : 'courses'}
            {query ? ` for \u201C${query}\u201D` : ''}
          </p>

          {visible.length > 0 ? (
            <div className="course-grid">
              {visible.map((course) => (
                <CourseCard course={course} key={course.slug} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No courses found</h2>
              <p>Try a different search term or clear the filters.</p>
              <button className="button button--lime" type="button" onClick={clearFilters}>
                <Icon name="reload" /> Clear filters
              </button>
            </div>
          )}

          <nav className="pagination" aria-label="Search result pages">
            <button
              type="button"
              className="pagination__step"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={goToPreviousPage}
            >
              <Icon name="arrowBack" />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                type="button"
                className={`pagination__page${number === currentPage ? ' is-active' : ''}`}
                aria-current={number === currentPage ? 'page' : undefined}
                data-page={number}
                onClick={handlePageButton}
              >
                {number}
              </button>
            ))}
            <button
              type="button"
              className="pagination__step"
              aria-label="Next page"
              disabled={currentPage === pageCount}
              onClick={goToNextPage}
            >
              <Icon name="arrowForward" />
            </button>
          </nav>
        </div>
      </section>
    </>
  )
}
