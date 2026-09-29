// Local content for the ByteSpace demo. Copy and pricing come from the supplied
// Figma exports (see `docs/assets.md`); there is no backend.

export type CurriculumModule = { title: string; body: string }
export type LessonPreview = { number: string; title: string; duration: string }
export type RatingRow = {
  stars: number
  count: number
  /** Fill width (%) when the design hand-sets it; otherwise derived from `count`. */
  bar?: number
}
export type CourseReview = {
  name: string
  role: string
  avatar: string
  ago: string
  rating: number
  quote: string
}

export type CourseDetails = {
  /** Long title used by the course page hero; the card shows `Course.title`. */
  fullTitle: string
  subtitle: string
  level: string
  rating: number
  reviewCount: number
  students: number
  totalLessons: number
  totalDuration: string
  /** One entry per paragraph. */
  description: string[]
  keyPoints: string[]
  sneakPeek: { src: string; alt: string }[]
  video: { src: string; alt: string }
  /** Lessons tab modules and sidebar preview; falls back to the Build Digital Asset content. */
  curriculum?: {
    modules: CurriculumModule[]
    preview: LessonPreview[]
    /** Overrides `totalLessons - preview.length` (the design says 99 for 112 lessons). */
    moreVideos?: number
  }
  /** Reviews tab; the histogram is derived from `rating` and `reviewCount` when absent. */
  reviews?: { breakdown?: RatingRow[]; items?: CourseReview[]; intro?: string }
}

/**
 * Card fields (`level`, `rating`, `lessons`, `duration`, `comments`, `price`) feed
 * `CourseCard` and search; `details` feeds the course pages. The design shows
 * different numbers in each place, so they are stored separately.
 */
export type Course = {
  slug: string
  title: string
  /** Drawn from `categories` below; filtering uses `includes`. */
  categories: string[]
  instructor: string
  creatorSlug: string
  level: string
  rating: number
  lessons: number
  duration: string
  comments: number
  /** Whole-dollar price, so filtering and formatting stay numeric. */
  price: number
  image: string
  imageAlt: string
  /** Part of the six landing/creator cards from the design. */
  featured?: boolean
  details: CourseDetails
}

export type Creator = {
  slug: string
  name: string
  role: string
  tagline: string
  bio: string[]
  avatar: string
  /** 52 px portrait shown in the course sidebar (differs from `avatar` in the design). */
  sidebarAvatar?: string
  products: number
  followers: number
}

export const CURRENCY = '$'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatPrice(price: number) {
  return priceFormatter.format(price)
}

/** Value shown by every "Learning Progress" bar in the design. */
export const learningProgress = 55

// "Featured" heads the list, then the design's category pills.
export const courseFilters = [
  'Featured',
  'Music',
  'Drawing & Painting',
  'Marketing',
  'Animation',
  'Social Media',
  'UI/UX Design',
  'Creative Marketing',
  'Digital Illustration',
  'Film & Video',
  'Crafts',
  'Freelance & Entrepreneurship',
  'Graphic Design',
  'Photography',
  'Productivity',
  'Web Development',
  'Data Science',
  'Cooking',
]

export const learningPaths = [
  { name: 'Design', icon: '/assets/icons/icon-category-design.svg' },
  { name: 'Development', icon: '/assets/icons/icon-category-development.svg' },
  { name: 'IT & Software', icon: '/assets/icons/icon-category-it-software.svg' },
  { name: 'Business', icon: '/assets/icons/icon-category-business.svg' },
  { name: 'Marketing', icon: '/assets/icons/icon-category-marketing.svg' },
  { name: 'Photography', icon: '/assets/icons/icon-category-photography.svg' },
]

/**
 * Every category a course can carry: the pills, the learning paths and the
 * footer's extra links. Search offers exactly this list.
 */
export const categories: string[] = [
  ...new Set([
    ...courseFilters.filter((name) => name !== 'Featured'),
    ...learningPaths.map((path) => path.name),
    'Finance',
    'Sport',
  ]),
]

export function courseHasCategory(course: Course, category: string) {
  return course.categories.includes(category)
}

/** Small overlapping faces shown next to the level chip on every course card. */
export const cardAvatars = [
  '/assets/creator-profile-creator-profile-c18c1eacda.png',
  '/assets/creator-profile-creator-profile-3ad412fe0f.png',
  '/assets/creator-profile-creator-profile-8e0412163a.png',
  '/assets/creator-profile-creator-profile-3859945b0b.png',
]

/** The seven faces of the "Happy Students" cards (hero, create & manage, auth). */
export const happyStudentAvatars = [
  '/assets/course-reviews-course-reviews-4dbffda228.png',
  '/assets/creator-profile-creator-profile-c18c1eacda.png',
  '/assets/home-home-40d4ad3caf.png',
  '/assets/home-home-e6c9467db0.png',
  '/assets/home-home-2f0049b55f.png',
  '/assets/home-home-3ff1efea98.png',
  '/assets/home-home-f6e12716fa.png',
]

const sharedSneakPeek = [
  { src: '/assets/course-details-rectangle-3f76ebf680.png', alt: 'Hand sketching app wireframes on paper' },
  { src: '/assets/course-details-rectangle-e363ccde9e.png', alt: 'Design tool with colour swatches open on a laptop' },
  { src: '/assets/course-details-rectangle-7e85079f92.png', alt: 'Design system boards open on a desktop monitor' },
  { src: '/assets/course-details-rectangle-8d7c8d1b26.png', alt: 'Colourful mobile app screens on two phones' },
]

const courseVideo = {
  src: '/assets/course-details-frame-c9df1e432b.png',
  alt: 'Course presenter in a purple jumper, with a play button over the preview',
}

const defaultKeyPoints = [
  'Foundational Concepts',
  'Design Principles Mastery',
  'Advanced Techniques in Digital Creation',
  'Project Showcase and Critique',
  'Optimizing for Various Platforms',
  'Digital Asset Management Best Practices',
  'Monetization Strategies',
  'Capstone Project: Building Your Portfolio',
]

/** Course-page fields for a course that has no bespoke details in the design. */
function detailsFor(
  course: Pick<Course, 'title' | 'level' | 'rating' | 'lessons' | 'duration'>,
  overrides: Partial<CourseDetails> & { description: string[] },
): CourseDetails {
  return {
    fullTitle: course.title,
    subtitle: 'Learn by building, with expert guidance at every step',
    level: course.level,
    rating: course.rating,
    reviewCount: 120,
    students: 180,
    totalLessons: course.lessons,
    totalDuration: course.duration,
    keyPoints: defaultKeyPoints,
    sneakPeek: sharedSneakPeek,
    video: courseVideo,
    ...overrides,
  }
}

/** The six cards that appear on the landing page and the creator profile. */
const landingCard = {
  instructor: 'purepearl studio',
  creatorSlug: 'purepearl-studio',
  level: 'Beginner',
  rating: 4.5,
  lessons: 17,
  duration: '2 hours 16 mins',
  comments: 59,
  price: 25,
  featured: true,
}

export const courseModules: CurriculumModule[] = [
  {
    title: 'Module 1: Introduction to Digital Assets',
    body: "Lay the groundwork with lessons like 'Understanding Digital Elements' and 'Navigating Design Software Tools.' Dive into the essentials of digital asset creation.",
  },
  {
    title: 'Module 2: Design Principles for Impact',
    body: "Master the principles that drive impactful designs with lessons such as 'Color Theory in Digital Design' and 'Typography Essentials.' Elevate your visual communication skills.",
  },
  {
    title: 'Module 4: User-Centric Design Strategies',
    body: "Understand 'Design Thinking in Digital Creation' and delve into 'User Experience (UX) Essentials.' Craft digital assets with a focus on user-centric design.",
  },
  {
    title: 'Module 5: Interactive Media and Engagement',
    body: "Engage your audience with lessons like 'Creating Interactive Presentations' and 'Integrating Multimedia Elements.' Master the art of creating immersive digital experiences.",
  },
  {
    title: 'Module 6: Project Showcase and Critique',
    body: "Perfect your presentation skills with 'Effective Presentation Techniques' and embrace collaboration with 'Peer Critique and Collaboration.' Showcase your work with confidence.",
  },
  {
    title: 'Module 7: Optimizing Digital Assets for Various Platforms',
    body: "Adapt your digital creations for 'Mobile Platforms' and optimize for 'Social Media.' Ensure widespread accessibility and engagement across diverse digital landscapes.",
  },
]

export const courseLessonPreview: LessonPreview[] = [
  { number: '01', title: 'Introduction to Digital Assets', duration: '12 mins' },
  { number: '02', title: 'Design Principles for Impacts', duration: '21 mins' },
  { number: '03', title: 'Advanced Techniques in Digital Creation', duration: '16 mins' },
]

/** The design's histogram; each `bar` is hand-set there, not proportional to `count`. */
const designRatingBreakdown: RatingRow[] = [
  { stars: 5, count: 720, bar: 92 },
  { stars: 4, count: 120, bar: 36 },
  { stars: 3, count: 21, bar: 9 },
  { stars: 2, count: 12, bar: 3 },
  { stars: 1, count: 16, bar: 5 },
]

const designReviews: CourseReview[] = [
  {
    name: 'PurePearl Studio',
    role: 'UI/UX Designer',
    avatar: '/assets/course-reviews-course-reviews-13645e2369.png',
    ago: 'a year ago',
    rating: 5,
    quote:
      '"The course provided me with a comprehensive understanding of digital asset creation. The lessons were in-depth, practical, and immediately applicable to my work. Highly recommended!"',
  },
  {
    name: 'Albert Flores',
    role: 'UI/UX Designer',
    avatar: '/assets/course-reviews-course-reviews-0c82569c42.png',
    ago: 'a year ago',
    rating: 5,
    quote:
      "This course transformed my approach to digital design. The combination of theory, hands-on exercises, and real-world applications made it a truly enriching experience. Excited to implement what I've learned!",
  },
  {
    name: 'Cody Fisher',
    role: 'UI/UX Designer',
    avatar: '/assets/course-reviews-course-reviews-1386882254.png',
    ago: 'a year ago',
    rating: 5,
    quote:
      'The project showcase and critique module created a collaborative environment where I could showcase my work, receive valuable feedback, and refine my skills. It added a unique and valuable dimension to the learning process.',
  },
  {
    name: 'Brooklyn Simmons',
    role: 'UI/UX Designer',
    avatar: '/assets/course-reviews-course-reviews-4dbffda228.png',
    ago: 'a year ago',
    rating: 5,
    quote:
      'The lessons on optimizing digital assets for various platforms were particularly insightful. The course adapts to the evolving digital landscape, and the engaging content kept me motivated throughout.',
  },
]

const featuredCourses: Course[] = [
  {
    ...landingCard,
    slug: 'learn-figma-from-basic',
    title: 'Learn Figma from Basic',
    categories: ['UI/UX Design', 'Design', 'Graphic Design'],
    image: '/assets/creator-profile-creator-profile-56e727c127.jpg',
    imageAlt: 'Two designers sketching interface wireframes on paper beside a laptop',
    details: detailsFor(
      { title: 'Learn Figma from Basic', level: 'Beginner', rating: 4.5, lessons: 17, duration: '2 hours 16 mins' },
      {
        reviewCount: 240,
        students: 199,
        description: [
          'Start from a blank canvas and finish with a confident Figma workflow. This course walks through frames, auto layout, components, and prototyping using the same exercises real product teams use, so the habits stick beyond the first project.',
        ],
        keyPoints: [
          'Frames and auto layout',
          'Components and variants',
          'Prototyping basics',
          'Design systems in Figma',
          'Handing off to developers',
        ],
      },
    ),
  },
  {
    ...landingCard,
    slug: 'build-digital-asset',
    title: 'Build Digital Asset',
    categories: ['Design', 'Digital Illustration', 'Graphic Design'],
    image: '/assets/creator-profile-creator-profile-8eaa5e0652.jpg',
    imageAlt: 'Close-up of a grid of line icons: music note, calendar, lock, microphone and magnifiers',
    details: {
      fullTitle: 'Build Digital Asset: A Comprehensive Guide',
      subtitle: 'Unlock the Power of Digital Creation with Expert Guidance',
      level: 'Intermediate',
      rating: 4.8,
      reviewCount: 172,
      students: 199,
      totalLessons: 112,
      totalDuration: '24 hours',
      description: [
      "Embark on an enlightening exploration into the world of digital creation with our comprehensive course, \"Build Digital Assets: A Comprehensive Guide.\" This transformative learning experience invites you to delve deep into the intricacies of crafting impactful digital content. From laying the groundwork with foundational concepts to mastering advanced techniques, this guide is meticulously curated to empower you with the skills essential for navigating the dynamic landscape of digital asset creation.",
      "In the initial modules, you'll establish a solid foundation by immersing yourself in the foundational concepts that form the backbone of digital asset creation. Understand the fundamental elements that constitute compelling digital content and gain proficiency in leveraging these elements to communicate effectively in the digital realm.",
      "As you progress through the course, you'll ascend to higher levels of expertise, delving into the nuances of design principles that drive impactful creations. Uncover the secrets behind effective visual communication, exploring color theory, typography, and layout strategies that elevate your digital assets to new heights. Engage in hands-on exercises that reinforce your understanding, allowing you to apply these principles in practical scenarios."
    ],
      keyPoints: defaultKeyPoints,
      sneakPeek: sharedSneakPeek,
      video: courseVideo,
      curriculum: { modules: courseModules, preview: courseLessonPreview, moreVideos: 99 },
      reviews: {
        breakdown: designRatingBreakdown,
        items: designReviews,
        intro:
          'Discover what our learners have to say about their experience with ‘Build Digital Assets: A Comprehensive Guide.’ Read reviews and ratings from individuals who have embarked on the transformative journey of mastering digital asset creation.',
      },
    },
  },
  {
    ...landingCard,
    slug: 'the-power-of-big-data',
    title: 'the Power of Big Data',
    categories: ['Data Science', 'IT & Software', 'Development'],
    image: '/assets/creator-profile-creator-profile-8096f37ca2.jpg',
    imageAlt: 'Analytics dashboard on a tablet showing usage distributions and trends',
    details: detailsFor(
      { title: 'the Power of Big Data', level: 'Beginner', rating: 4.5, lessons: 17, duration: '2 hours 16 mins' },
      {
        reviewCount: 131,
        students: 214,
        description: [
          'Learn how raw events become decisions. This course covers the shape of modern data, the dashboards people actually read, and the questions worth asking before you build one.',
        ],
        keyPoints: [
          'Reading a dashboard critically',
          'Events, funnels and distributions',
          'Choosing the right chart',
          'Privacy-safe measurement',
          'Writing a data brief',
          'Presenting findings to stakeholders',
        ],
      },
    ),
  },
  {
    ...landingCard,
    slug: 'balancing-productivity-and-self-care',
    title: 'Balancing Productivity and Self-Care',
    categories: ['Productivity', 'Business'],
    image: '/assets/creator-profile-creator-profile-9a66fe68c4.jpg',
    imageAlt: 'Desk with an iMac showing the words "Do more" beside a keyboard and plant',
    details: detailsFor(
      {
        title: 'Balancing Productivity and Self-Care',
        level: 'Beginner',
        rating: 4.5,
        lessons: 17,
        duration: '2 hours 16 mins',
      },
      {
        reviewCount: 98,
        students: 176,
        description: [
          'Sustainable output beats heroic sprints. Build a weekly rhythm that protects deep work, recovery, and the relationships that make the work worth doing.',
        ],
        keyPoints: [
          'Designing a realistic week',
          'Deep work without burnout',
          'Recovery as part of the plan',
          'Boundaries with collaborators',
          'Reviewing and adjusting',
        ],
      },
    ),
  },
  {
    ...landingCard,
    slug: 'mastering-money-management',
    title: 'Mastering Money Management',
    categories: ['Business', 'Finance', 'Marketing'],
    image: '/assets/creator-profile-creator-profile-764ea2b557.jpg',
    imageAlt: 'Green line chart trending upward on a laptop screen',
    details: detailsFor(
      { title: 'Mastering Money Management', level: 'Beginner', rating: 4.5, lessons: 17, duration: '2 hours 16 mins' },
      {
        reviewCount: 143,
        students: 231,
        description: [
          'Understand cash flow, pricing, and planning for a freelance or creator business. Practical templates and plain-language explanations, no spreadsheets required.',
        ],
        keyPoints: [
          'Track money without dread',
          'Pricing your work',
          'Irregular income planning',
          'Taxes and set-asides',
          'Saving for slow months',
        ],
      },
    ),
  },
  {
    ...landingCard,
    slug: 'from-idea-to-startup-success',
    title: 'From Idea to Startup Success',
    categories: ['Business', 'Freelance & Entrepreneurship', 'Marketing'],
    image: '/assets/creator-profile-creator-profile-df575fc9d2.jpg',
    imageAlt: 'A team gathered around a wall of sticky notes in a bright meeting room',
    details: detailsFor(
      { title: 'From Idea to Startup Success', level: 'Beginner', rating: 4.5, lessons: 17, duration: '2 hours 16 mins' },
      {
        reviewCount: 87,
        students: 158,
        description: [
          'Turn a rough idea into something people will pay for. Validate cheaply, build the smallest useful version, and learn what early customers are really telling you.',
        ],
        keyPoints: [
          'Finding a problem worth solving',
          'Cheap validation experiments',
          'Building the smallest version',
          'Talking to early customers',
          'Deciding when to scale',
        ],
      },
    ),
  },
]

type CatalogueSeed = {
  slug: string
  title: string
  categories: string[]
  instructor: string
  creatorSlug: string
  level: string
  rating: number
  lessons: number
  duration: string
  comments: number
  price: number
  /** Index into the six card photos. */
  photo: number
  blurb: string
}

const cardPhotos = featuredCourses.map((course) => ({ src: course.image, alt: course.imageAlt }))

// Extra catalogue entries so search, sort and pagination have something to work with.
// The design repeats the six landing cards; these vary price, level, rating and category.
const catalogueSeeds: CatalogueSeed[] = [
  { slug: 'watercolor-fundamentals', title: 'Watercolor Fundamentals', categories: ['Drawing & Painting', 'Crafts', 'Design'], instructor: 'nova labs', creatorSlug: 'nova-labs', level: 'Beginner', rating: 4.7, lessons: 14, duration: '1 hour 48 mins', comments: 32, price: 19, photo: 3, blurb: 'Wet-on-wet washes, layering and colour mixing, from your first brush stroke to a finished landscape.' },
  { slug: 'music-production-basics', title: 'Music Production Basics', categories: ['Music'], instructor: 'pixelcraft studio', creatorSlug: 'pixelcraft-studio', level: 'Beginner', rating: 4.6, lessons: 21, duration: '3 hours 5 mins', comments: 41, price: 29, photo: 0, blurb: 'Build your first beat, arrange a track and mix it so it sounds good on any speaker.' },
  { slug: 'motion-graphics-after-effects', title: 'Motion Graphics with After Effects', categories: ['Animation', 'Film & Video', 'Design'], instructor: 'nova labs', creatorSlug: 'nova-labs', level: 'Intermediate', rating: 4.8, lessons: 36, duration: '6 hours 20 mins', comments: 88, price: 49, photo: 1, blurb: 'Keyframes, easing and expressions for titles, logo stings and animated explainers.' },
  { slug: 'social-media-content-playbook', title: 'Social Media Content Playbook', categories: ['Social Media', 'Marketing', 'Creative Marketing'], instructor: 'pixelcraft studio', creatorSlug: 'pixelcraft-studio', level: 'Beginner', rating: 4.2, lessons: 12, duration: '1 hour 30 mins', comments: 17, price: 19, photo: 5, blurb: 'Plan a month of posts, write hooks that stop the scroll and measure what actually works.' },
  { slug: 'portrait-photography-essentials', title: 'Portrait Photography Essentials', categories: ['Photography', 'Film & Video'], instructor: 'nova labs', creatorSlug: 'nova-labs', level: 'Intermediate', rating: 4.7, lessons: 19, duration: '2 hours 55 mins', comments: 54, price: 39, photo: 2, blurb: 'Light, posing and direction for natural portraits, indoors and out.' },
  { slug: 'full-stack-web-development', title: 'Full-Stack Web Development', categories: ['Web Development', 'Development', 'IT & Software'], instructor: 'pixelcraft studio', creatorSlug: 'pixelcraft-studio', level: 'Advanced', rating: 4.9, lessons: 64, duration: '14 hours 10 mins', comments: 203, price: 89, photo: 4, blurb: 'Ship a complete app: a React front end, an API, a database and a deployment pipeline.' },
  { slug: 'home-cooking-masterclass', title: 'Home Cooking Masterclass', categories: ['Cooking', 'Crafts'], instructor: 'nova labs', creatorSlug: 'nova-labs', level: 'Beginner', rating: 4.4, lessons: 18, duration: '2 hours 40 mins', comments: 29, price: 15, photo: 3, blurb: 'Knife skills, pan sauces and a dozen weeknight dishes you will cook on repeat.' },
  { slug: 'freelance-client-playbook', title: 'Freelance Client Playbook', categories: ['Freelance & Entrepreneurship', 'Business', 'Productivity'], instructor: 'pixelcraft studio', creatorSlug: 'pixelcraft-studio', level: 'Intermediate', rating: 4.3, lessons: 15, duration: '2 hours 10 mins', comments: 23, price: 35, photo: 5, blurb: 'Find clients, scope work, write proposals and get paid on time.' },
  { slug: 'fitness-habits-for-busy-people', title: 'Fitness Habits for Busy People', categories: ['Sport', 'Productivity'], instructor: 'nova labs', creatorSlug: 'nova-labs', level: 'Beginner', rating: 4.1, lessons: 10, duration: '1 hour 15 mins', comments: 12, price: 12, photo: 2, blurb: 'Twenty-minute routines and habit tricks that fit around a full calendar.' },
  { slug: 'data-science-with-python', title: 'Data Science with Python', categories: ['Data Science', 'IT & Software', 'Development'], instructor: 'pixelcraft studio', creatorSlug: 'pixelcraft-studio', level: 'Advanced', rating: 4.8, lessons: 48, duration: '9 hours 30 mins', comments: 117, price: 79, photo: 0, blurb: 'Clean data with pandas, explore it visually and train your first predictive models.' },
  { slug: 'digital-illustration-in-procreate', title: 'Digital Illustration in Procreate', categories: ['Digital Illustration', 'Drawing & Painting'], instructor: 'nova labs', creatorSlug: 'nova-labs', level: 'Intermediate', rating: 4.6, lessons: 26, duration: '4 hours 25 mins', comments: 62, price: 45, photo: 1, blurb: 'Brushes, layers and lighting for illustrations you will want to print.' },
  { slug: 'brand-identity-design', title: 'Brand Identity Design', categories: ['Graphic Design', 'Design', 'Creative Marketing'], instructor: 'pixelcraft studio', creatorSlug: 'pixelcraft-studio', level: 'Intermediate', rating: 4.5, lessons: 30, duration: '5 hours 5 mins', comments: 71, price: 59, photo: 4, blurb: 'From research and moodboards to a logo, palette and a brand guide clients sign off on.' },
]

const catalogueCourses: Course[] = catalogueSeeds.map(({ photo, blurb, ...seed }) => {
  const image = cardPhotos[photo]
  const course = { ...seed, image: image.src, imageAlt: image.alt }
  return {
    ...course,
    details: detailsFor(course, {
      reviewCount: 40 + seed.comments,
      students: 90 + seed.comments * 2,
      description: [blurb],
    }),
  }
})

export const courses: Course[] = [...featuredCourses, ...catalogueCourses]

/** The six cards from the design, in order. */
export const landingCourses = courses.filter((course) => course.featured)

export const creators: Creator[] = [
  {
    slug: 'purepearl-studio',
    name: 'PurePearl Studio',
    role: 'Professional Creator',
    tagline: 'Passionate UI/UX, Web designer',
    bio: [
      'Welcome to the creative world of PurePearl Studio. Here, you’ll discover the passion, expertise, and inspiration that drive my creative journey. Let’s explore and learn together!',
      'Dive into my creative portfolio, showcasing a glimpse of my artistic endeavors. From digital designs to multimedia projects, each piece tells a unique story. Explore the world of creativity with me.',
    ],
    avatar: '/assets/creator-profile-image-8769fdad0a.png',
    sidebarAvatar: '/assets/course-details-course-details-4a7d0e390b.jpg',
    products: 3,
    followers: 12,
  },
  {
    slug: 'nova-labs',
    name: 'Nova Labs',
    role: 'Creative Instructor',
    tagline: 'Art, photography and film',
    bio: ['Nova Labs teaches hands-on creative skills, from watercolour to motion graphics.'],
    avatar: '/assets/creator-profile-creator-profile-3ad412fe0f.png',
    products: 6,
    followers: 8,
  },
  {
    slug: 'pixelcraft-studio',
    name: 'PixelCraft Studio',
    role: 'Technology Educator',
    tagline: 'Code, data and digital marketing',
    bio: ['PixelCraft Studio helps learners build technical and marketing skills through real projects.'],
    avatar: '/assets/creator-profile-creator-profile-8e0412163a.png',
    products: 6,
    followers: 10,
  },
]

export function findCourse(slug: string | undefined) {
  return courses.find((course) => course.slug === slug)
}

export function findCreator(slug: string | undefined) {
  return creators.find((creator) => creator.slug === slug)
}

export const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Enthusiastic Learner',
    quote:
      'ByteSpace has transformed my approach to learning. The diverse range of courses and the quality of content provided by creators have exceeded my expectations. The platform truly fosters a sense of community and lifelong learning.',
    avatar: '/assets/home-ellipse-f4921d3e28.png',
  },
  {
    name: 'James L.',
    role: 'Lifelong Learner',
    quote:
      "I've tried several online learning platforms, and ByteSpace stands out for its vibrant community and the variety of courses available. The easy navigation and engaging content make it a go-to platform for continuous skill development.",
    avatar: '/assets/home-ellipse-08e3eab14a.png',
  },
  {
    name: 'Alex B.',
    role: 'Inspired Creator',
    quote:
      "As a creator, ByteSpace has been a game-changer for me. The Course Editor is user-friendly, and the support from the community is incredible. It's fulfilling to see my courses making a positive impact on learners globally.",
    avatar: '/assets/home-ellipse-eae493dc0f.png',
  },
]

export const courseIncludes = [
  { label: 'Learning Resources', icon: 'resources' as const },
  { label: 'Quality Lesson Videos', icon: 'video' as const },
  { label: 'Certificate of Completion', icon: 'certificate' as const },
  { label: 'Private Consultation', icon: 'consultation' as const },
]

const REVIEWS_INTRO_TAIL =
  'Read reviews and ratings from individuals who have embarked on the transformative journey of mastering this subject.'

/** Star histogram whose mean matches `rating` and whose counts add up to `total`. */
function deriveBreakdown(rating: number, total: number): RatingRow[] {
  const target = Math.min(Math.max(rating, 1.1), 4.95)
  const weights = (k: number) => [5, 4, 3, 2, 1].map((stars) => Math.exp(k * stars))
  const mean = (k: number) => {
    const w = weights(k)
    return w.reduce((sum, value, i) => sum + value * (5 - i), 0) / w.reduce((sum, value) => sum + value, 0)
  }
  let low = -6
  let high = 12
  for (let step = 0; step < 50; step++) {
    const mid = (low + high) / 2
    if (mean(mid) < target) low = mid
    else high = mid
  }
  const w = weights((low + high) / 2)
  const weightSum = w.reduce((sum, value) => sum + value, 0)
  const counts = w.map((value) => Math.round((value / weightSum) * total))
  counts[0] += total - counts.reduce((sum, value) => sum + value, 0)
  return counts.map((count, i) => ({ stars: 5 - i, count }))
}

/** Curriculum for the Lessons tab and the sidebar; "N more videos" is computed unless the design fixes it. */
export function curriculumFor(details: CourseDetails) {
  const modules = details.curriculum?.modules ?? courseModules
  const preview = details.curriculum?.preview ?? courseLessonPreview
  const moreVideos = details.curriculum?.moreVideos ?? Math.max(details.totalLessons - preview.length, 0)
  return { modules, preview, moreVideos }
}

/** Reviews-tab content with the summary figures derived from the histogram. */
export function reviewsFor(details: CourseDetails) {
  const breakdown = details.reviews?.breakdown ?? deriveBreakdown(details.rating, details.reviewCount)
  const total = breakdown.reduce((sum, row) => sum + row.count, 0)
  const average = total === 0 ? 0 : breakdown.reduce((sum, row) => sum + row.stars * row.count, 0) / total
  const busiest = Math.max(...breakdown.map((row) => row.count), 1)
  const rows = breakdown.map((row) => ({ ...row, bar: row.bar ?? Math.round((row.count / busiest) * 100) }))
  const intro =
    details.reviews?.intro ??
    `Discover what our learners have to say about their experience with ‘${details.fullTitle}.’ ${REVIEWS_INTRO_TAIL}`
  return { rows, total, average, items: details.reviews?.items ?? designReviews, intro }
}

/** Search results limited to one category; the name must exist in `categories`. */
export const categoryLink = (name: string) => `/search?category=${encodeURIComponent(name)}`

export const footerColumns = [
  {
    heading: 'Browse',
    links: [
      { label: 'Featured Courses', to: '/search' },
      { label: 'Featured Categories', to: '/#paths' },
      { label: 'Business', to: categoryLink('Business') },
      { label: 'IT', to: categoryLink('IT & Software') },
      { label: 'Design', to: categoryLink('Design') },
    ],
  },
  {
    heading: 'Categories',
    links: [
      { label: 'Development', to: categoryLink('Development') },
      { label: 'Marketing', to: categoryLink('Marketing') },
      { label: 'Photography', to: categoryLink('Photography') },
      { label: 'Finance', to: categoryLink('Finance') },
      { label: 'Sport', to: categoryLink('Sport') },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Become a Creator', to: '/signup' },
      { label: 'Affiliate Program', to: '/#creators' },
      { label: 'Contact', to: '/legal#contact' },
      { label: 'Help', to: '/legal#help' },
      { label: 'About', to: '/#growth' },
    ],
  },
]
