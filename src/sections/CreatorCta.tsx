import { Link } from 'react-router-dom'
import { BakedShape, Shape3D } from '../components/Shape3D'
import { Stage } from '../components/Stage'

/**
 * Seven shapes in Figma coordinates of the 1440x488 CTA frame (page y minus 4580).
 * Cropped-at-the-edge shapes use the raw render plus a tint; the rest are baked exports.
 */
function CtaShapes() {
  return (
    <>
      <Shape3D
        loading="lazy"
        src="/assets/renders/home-home-92f21ffd63.webp"
        tint="lime"
        placement={{ x: -118, y: -162, w: 385, mobile: { x: '-80px', y: '-80px', w: '170px' } }}
      />
      <BakedShape
        loading="lazy"
        src="/assets/shapes/home-cta-white-squiggle-b.png"
        placement={{ x: 178.8, y: 5, w: 175.8, h: 175.8, mobile: { hidden: true } }}
      />
      <BakedShape
        loading="lazy"
        src="/assets/shapes/home-cta-lime-pyramid.png"
        placement={{ x: 1078, y: 0, w: 188.9, h: 188.5, mobile: { hidden: true } }}
      />
      <Shape3D
        loading="lazy"
        src="/assets/renders/home-home-a96322e3c1.webp"
        tint="white"
        placement={{ x: 1226, y: 6, w: 370, mobile: { x: 'calc(100% - 90px)', y: '-70px', w: '170px' } }}
      />
      <Shape3D
        loading="lazy"
        src="/assets/renders/home-home-f5b5a7e7fe.webp"
        tint="white"
        placement={{ x: -48, y: 225, w: 188, mobile: { hidden: true } }}
      />
      <Shape3D
        loading="lazy"
        src="/assets/renders/home-home-2b33854c48.webp"
        tint="lime"
        placement={{ x: 20, y: 299, w: 342, mobile: { hidden: true } }}
      />
      <Shape3D
        loading="lazy"
        src="/assets/renders/home-home-021f81bfc4.webp"
        tint="lime"
        placement={{ x: 1110, y: 289, w: 330, mobile: { x: 'calc(100% - 84px)', y: 'calc(100% - 110px)', w: '150px' } }}
      />
    </>
  )
}

export function CreatorCta() {
  return (
    <section className="creator-cta">
      <div className="grid-overlay" aria-hidden="true" />
      <Stage width={1440} height={488} className="creator-cta__stage">
        <CtaShapes />
        <div className="creator-cta__content">
          <h2>Unlock Your Potential as a Creator with ByteSpace</h2>
          <p>
            Experience the collaboration of numerous creators and an expanding selection of courses. Register now and
            become a part of a community comprising over 10,000 local and international creators. Utilize our Course
            Editor, and showcase your expertise by publishing your finest course on the ByteSpace Course Library.
          </p>
          <Link className="button button--lime" to="/signup">
            Join as Creator
          </Link>
        </div>
      </Stage>
    </section>
  )
}
