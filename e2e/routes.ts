/** Every routed page, with the Figma export (if any) it is compared against. */
export const routes = [
  { name: 'home', path: '/', design: 'Home.png' },
  { name: 'login', path: '/login', design: 'Login.png' },
  { name: 'register', path: '/signup', design: 'Register.png' },
  { name: 'search', path: '/search', design: 'Search Page.png' },
  { name: 'course-details', path: '/courses/build-digital-asset', design: 'Course Details.png' },
  { name: 'course-lessons', path: '/courses/build-digital-asset/lessons', design: 'Course Lessons.png' },
  { name: 'course-reviews', path: '/courses/build-digital-asset/reviews', design: 'Course Reviews.png' },
  { name: 'creator', path: '/creators/purepearl-studio', design: 'Creator Profile.png' },
  { name: 'not-found', path: '/no-such-page', design: '404 Not Found.png' },
  { name: 'legal', path: '/legal', design: undefined },
] as const

export const widths = [1440, 1280, 1024, 768, 390, 320] as const
