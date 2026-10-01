import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AuthPage } from './pages/AuthPage'
import { CourseDetailsPage } from './pages/course/CourseDetailsPage'
import { CourseLayout } from './pages/course/CourseLayout'
import { CourseLessonsPage } from './pages/course/CourseLessonsPage'
import { CourseReviewsPage } from './pages/course/CourseReviewsPage'
import { CreatorRoute } from './pages/CreatorPage'
import { HomePage } from './pages/HomePage'
import { LegalPage } from './pages/LegalPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SearchPage } from './pages/SearchPage'

function App() {
  return (
    <Routes>
      {/* Auth pages render their own full-height blue canvas, without the site footer. */}
      <Route path="/login" element={<AuthPage key="login" mode="login" />} />
      <Route path="/signup" element={<AuthPage key="signup" mode="signup" />} />

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/courses/:slug" element={<CourseLayout />}>
          <Route index element={<CourseDetailsPage />} />
          <Route path="lessons" element={<CourseLessonsPage />} />
          <Route path="reviews" element={<CourseReviewsPage />} />
        </Route>
        <Route path="/creators/:slug" element={<CreatorRoute />} />
        {/* Demo shortcut: the header's "Creators" link has no index page, so it lands on the featured creator. */}
        <Route path="/creators" element={<Navigate to="/creators/purepearl-studio" replace />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
