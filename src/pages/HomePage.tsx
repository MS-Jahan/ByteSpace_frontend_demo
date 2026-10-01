import { CreateManage } from '../sections/CreateManage'
import { CreatorCta } from '../sections/CreatorCta'
import { Discover } from '../sections/Discover'
import { Growth } from '../sections/Growth'
import { Hero } from '../sections/Hero'
import { LearningPaths } from '../sections/LearningPaths'
import { LogoStrip } from '../sections/LogoStrip'
import { Testimonials } from '../sections/Testimonials'
import { usePageTitle } from '../usePageTitle'

export function HomePage() {
  usePageTitle()
  return (
    <>
      <Hero />
      <LogoStrip />
      <Discover />
      <LearningPaths />
      <div className="home-frame">
        <Growth />
        <CreateManage />
      </div>
      <CreatorCta />
      <Testimonials />
    </>
  )
}
