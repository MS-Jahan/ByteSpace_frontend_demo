import { testimonials } from '../data'

export function Testimonials() {
  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <header className="testimonials__heading">
          <h2>Discover What Our Community Is Saying</h2>
          <p>
            At ByteSpace, our vibrant community of learners and creators is at the heart of what we do. Hear directly
            from those who have experienced the transformative journey of learning and creating on our platform. Explore
            testimonials that reflect the diverse perspectives of enthusiastic learners and accomplished creators.
          </p>
        </header>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <figure className="testimonial-card" key={testimonial.name}>
              <img className="testimonial-card__avatar" src={testimonial.avatar} alt="" loading="lazy" />
              <figcaption>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </figcaption>
              <blockquote>&quot;{testimonial.quote}&quot;</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
