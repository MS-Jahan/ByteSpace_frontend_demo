import { BakedShape } from '../components/Shape3D'
import { CourseCard } from '../components/CourseCard'
import { ProgressLine } from '../components/ProgressLine'
import { Stage } from '../components/Stage'
import { landingCourses, learningProgress } from '../data'

const stats = [
  { value: '12K', label: 'Students' },
  { value: '70+', label: 'Courses' },
  { value: '16', label: 'Creators' },
]

export function Growth() {
  return (
    <section className="growth" id="growth">
      <div className="container growth__layout">
        <div className="growth__copy">
          <h2>Your Path to Professional Growth Starts Here!</h2>
          <p className="body-copy">
            Explore our curated selection of courses tailored to enhance your capabilities and accelerate your career
            journey. Whether you are looking to sharpen specific skills, gain industry expertise, or embark on a new
            career path entirely, we have the resources you need.
          </p>
          <dl className="growth__stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Art in Figma pixels: an upright course card, the person in front of it, the progress card and a squiggle. */}
        <Stage
          width={600}
          height={560}
          className="growth__art"
          decorative
          // Narrow phones: a static restage instead of scaling the whole
          // composition (its 10px labels would shrink to ~6px).
          mobile={
            <div className="growth__m-art" aria-hidden="true">
              <div className="growth__m-card">
                <CourseCard course={landingCourses[0]} decorative />
              </div>
              <div className="growth__m-person">
                <img src="/assets/cutouts/growth-person.png" alt="" loading="lazy" />
              </div>
              <div className="float-card float-card--progress growth__m-progress">
                <small>Learning Progress</small>
                <strong>{learningProgress}%</strong>
                <ProgressLine value={learningProgress} />
              </div>
            </div>
          }
        >
          <div className="growth__card">
            <CourseCard course={landingCourses[0]} decorative />
          </div>
          <div className="growth__person">
            <img src="/assets/cutouts/growth-person.png" alt="" loading="lazy" />
          </div>
          <div className="float-card float-card--progress growth__progress">
            <small>Learning Progress</small>
            <strong>{learningProgress}%</strong>
            <ProgressLine value={learningProgress} />
          </div>
          <BakedShape
            className="growth__squiggle"
            src="/assets/shapes/home-growth-lime-squiggle-a.png"
            placement={{ x: 403, y: 67, w: 216, h: 216 }}
          />
        </Stage>
      </div>
    </section>
  )
}
