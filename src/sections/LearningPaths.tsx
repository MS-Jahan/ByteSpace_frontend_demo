import { Link } from 'react-router-dom'
import { categoryLink, learningPaths } from '../data'

export function LearningPaths() {
  return (
    <section className="section paths" id="paths">
      <div className="container">
        <header className="section-heading section-heading--center">
          <h2>Explore Diverse Learning Paths at Bytespace</h2>
          <p>
            At Bytespace, we believe in empowering individuals through knowledge. Our diverse range of courses spans
            various fields, ensuring there&rsquo;s something for everyone. Unleash your potential and explore our
            carefully curated categories.
          </p>
        </header>
        <div className="path-grid">
          {learningPaths.map((path) => (
            <Link className="path-tile" key={path.name} to={categoryLink(path.name)}>
              <span className="path-tile__icon" aria-hidden="true">
                <img src={path.icon} alt="" width={36} height={36} />
              </span>
              <strong>{path.name}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
