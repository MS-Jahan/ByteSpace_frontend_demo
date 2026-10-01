import type { Course } from './data'

/** Placeholder labels double as the "no filter" value, as in the design's pills. */
export const LEVEL_LABEL = 'Level'
export const CATEGORY_LABEL = 'Category'
export const levels = [LEVEL_LABEL, 'Beginner', 'Intermediate', 'Advanced']
export const sorts = ['Most relevant', 'Highest rated', 'Price: low to high', 'Price: high to low']

export function sortCourses(list: Course[], sort: string) {
  switch (sort) {
    case 'Highest rated':
      return [...list].sort((a, b) => b.rating - a.rating || b.details.reviewCount - a.details.reviewCount)
    case 'Price: low to high':
      return [...list].sort((a, b) => a.price - b.price)
    case 'Price: high to low':
      return [...list].sort((a, b) => b.price - a.price)
    default:
      return list
  }
}
