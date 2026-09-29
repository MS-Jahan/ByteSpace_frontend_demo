import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { categories, courses, creators, landingCourses } from '../data'

describe('course data', () => {
  it('seeds at least 18 distinct, varied search entries', () => {
    expect(courses.length).toBeGreaterThanOrEqual(18)
    expect(new Set(courses.map((course) => course.slug)).size).toBe(courses.length)
    expect(new Set(courses.map((course) => course.price)).size).toBeGreaterThan(5)
    expect(new Set(courses.map((course) => course.level)).size).toBeGreaterThan(2)
    expect(new Set(courses.map((course) => course.rating)).size).toBeGreaterThan(4)
  })

  it('keeps the six landing cards exactly as designed', () => {
    expect(landingCourses).toHaveLength(6)
    for (const course of landingCourses) {
      expect([course.level, course.rating, course.lessons, course.duration, course.comments, course.price]).toEqual([
        'Beginner',
        4.5,
        17,
        '2 hours 16 mins',
        59,
        25,
      ])
    }
  })

  it('only uses categories from the shared vocabulary, and every category has a course', () => {
    for (const course of courses) {
      for (const category of course.categories) expect(categories).toContain(category)
    }
    for (const category of categories) {
      expect(
        courses.some((course) => course.categories.includes(category)),
        category,
      ).toBe(true)
    }
  })

  it('points every course at an existing creator', () => {
    const slugs = creators.map((creator) => creator.slug)
    for (const course of courses) expect(slugs).toContain(course.creatorSlug)
  })

  it('references only image files that exist', () => {
    const source = readFileSync(path.resolve(process.cwd(), 'src/data.ts'), 'utf8')
    const files = [...source.matchAll(/'\/assets\/([^']+)'/g)].map((match) => match[1])
    expect(files.length).toBeGreaterThan(20)
    for (const file of files) {
      expect(existsSync(path.resolve(process.cwd(), 'public/assets', file)), file).toBe(true)
    }
  })
})
