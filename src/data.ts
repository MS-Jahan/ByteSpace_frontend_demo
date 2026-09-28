export const categories = [
  { name: 'All courses', count: 70, icon: '✦' },
  { name: 'Design', count: 18, icon: '◈' },
  { name: 'Development', count: 24, icon: '⌘' },
  { name: 'IT & Software', count: 12, icon: '▣' },
  { name: 'Business', count: 9, icon: '↗' },
  { name: 'Marketing', count: 11, icon: '◎' },
  { name: 'Photography', count: 8, icon: '◉' },
]

export type Course = {
  title: string
  category: string
  instructor: string
  rating: string
  reviews: string
  lessons: string
  level: string
  price: string
  image: string
  accent: string
  initials: string
}

export const courses: Course[] = [
  {
    title: 'Build Digital Assets: A Complete Guide',
    category: 'Design',
    instructor: 'Purepearl Studio',
    rating: '4.8',
    reviews: '172',
    lessons: '24 lessons',
    level: 'Intermediate',
    price: '$49',
    image: '/assets/course-details-course-details-1dd4796eb5.jpg',
    accent: '#f2ede7',
    initials: 'PS',
  },
  {
    title: 'The Complete Product Design Course',
    category: 'Design',
    instructor: 'Nolan Vex',
    rating: '4.9',
    reviews: '208',
    lessons: '18 lessons',
    level: 'Beginner',
    price: '$39',
    image: '/assets/course-details-course-details-4a7d0e390b.jpg',
    accent: '#e7edf4',
    initials: 'NV',
  },
  {
    title: 'Learn to Code: Modern Web Development',
    category: 'Development',
    instructor: 'Rina Matsuda',
    rating: '4.7',
    reviews: '96',
    lessons: '32 lessons',
    level: 'Beginner',
    price: '$59',
    image: '/assets/course-details-course-details-6bdec61b47.jpg',
    accent: '#e8f2ef',
    initials: 'RM',
  },
  {
    title: 'Brand Strategy for a New Generation',
    category: 'Marketing',
    instructor: 'Alex Carter',
    rating: '4.9',
    reviews: '134',
    lessons: '16 lessons',
    level: 'All levels',
    price: '$45',
    image: '/assets/creator-profile-creator-profile-8e0412163a.png',
    accent: '#eee8e1',
    initials: 'AC',
  },
  {
    title: 'Creative Photography: See the Light',
    category: 'Photography',
    instructor: 'Jules Moreau',
    rating: '4.8',
    reviews: '81',
    lessons: '21 lessons',
    level: 'Intermediate',
    price: '$35',
    image: '/assets/course-details-course-details-92a3408308.jpg',
    accent: '#e9ecee',
    initials: 'JM',
  },
  {
    title: 'Build a Business That Moves You',
    category: 'Business',
    instructor: 'Theo Brooks',
    rating: '5.0',
    reviews: '61',
    lessons: '14 lessons',
    level: 'Beginner',
    price: '$29',
    image: '/assets/course-details-course-details-af5773462d.jpg',
    accent: '#f2ebe4',
    initials: 'TB',
  },
]

export const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Enthusiastic learner',
    quote:
      'ByteSpace has transformed my approach to learning. The range of courses and the quality of content have exceeded my expectations.',
    avatar: '/assets/course-reviews-course-reviews-13645e2369.png',
  },
  {
    name: 'Michael R.',
    role: 'Product designer',
    quote:
      'I found the exact skills I needed for my next career step. Every course feels thoughtful, useful, and made by people who care.',
    avatar: '/assets/course-reviews-course-reviews-0c82569c42.png',
  },
  {
    name: 'David L.',
    role: 'Inspired creator',
    quote:
      'As a creator, ByteSpace has been a game-changer. The community makes it rewarding to share what I know with learners everywhere.',
    avatar: '/assets/course-reviews-course-reviews-4dbffda228.png',
  },
]
