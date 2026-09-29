import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvatarStack } from '../components/AvatarStack'
import { Icon } from '../components/Icons'
import { ProgressLine } from '../components/ProgressLine'
import { BakedShape, Shape3D } from '../components/Shape3D'
import { Stage } from '../components/Stage'
import { happyStudentAvatars, learningProgress } from '../data'

/**
 * Positions are Figma coordinates in the 1440x1024 Home frame. The shapes the
 * design crops at the frame edge use the uncropped grey render plus a tint (the
 * hero's own `overflow: clip` crops them); the others are the baked exports.
 * `mobile` places them for the stacked layout, always outside the text area.
 */
function HeroShapes() {
  return (
    <>
      <Shape3D
        src="/assets/renders/home-home-92f21ffd63.webp"
        tint="lime"
        placement={{ x: -118, y: 221, w: 385, mobile: { x: '-100px', y: 'calc(100% - 350px)', w: '170px' } }}
      />
      <Shape3D
        src="/assets/renders/home-home-a96322e3c1.webp"
        tint="lime"
        placement={{ x: 1231, y: 221, w: 370, mobile: { x: 'calc(100% - 64px)', y: 'calc(100% - 340px)', w: '150px' } }}
      />
      <Shape3D
        src="/assets/renders/home-home-021f81bfc4.webp"
        tint="white"
        placement={{ x: 1127, y: 672, w: 330, mobile: { x: 'calc(100% - 84px)', y: 'calc(100% - 170px)', w: '140px' } }}
      />
      <BakedShape
        src="/assets/shapes/home-hero-white-squiggle-b.png"
        placement={{ x: 183.8, y: 477, w: 175.8, h: 175.8, mobile: { hidden: true } }}
      />
      <BakedShape
        src="/assets/shapes/home-hero-white-torus.png"
        placement={{ x: 14.4, y: 681.3, w: 343.7, h: 342.7, mobile: { hidden: true } }}
      />
      <BakedShape
        src="/assets/shapes/home-hero-white-pyramid.png"
        placement={{ x: 1104, y: 463.6, w: 188.9, h: 188.9, mobile: { hidden: true } }}
      />
    </>
  )
}

export function Hero() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
  }

  return (
    <section className="hero" id="home">
      <div className="grid-overlay" aria-hidden="true" />
      <Stage width={1440} height={1024} className="hero__stage">
        <div className="hero__ring" aria-hidden="true" />
        <HeroShapes />

        <div className="hero__content">
          <h1>Get Access to Hundreds Courses Available</h1>
          <p className="hero__intro">
            Unlock your creativity, gain valuable knowledge, and grow your business with our wide range of courses.
          </p>
          <form className="hero-search" role="search" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="course-search">
              Search courses
            </label>
            <div className="hero-search__field">
              <Icon name="search" />
              <input
                id="course-search"
                name="search"
                type="search"
                placeholder="Course, topic, creator"
                value={query}
                onChange={handleQueryChange}
              />
            </div>
            <button className="button button--lime" type="submit">
              Search
            </button>
          </form>
        </div>

        <div className="hero__art" aria-hidden="true">
          <img className="hero__person" src="/assets/home-image-15c3a6ff74.png" alt="" />
          <div className="float-card hero__card hero__card--theme">
            <strong>UI/UX Design</strong>
            <small>
              200 Courses <span>•</span> 1000+ Students
            </small>
          </div>
          <div className="float-card float-card--progress hero__card hero__card--progress">
            <small>Learning Progress</small>
            <strong>{learningProgress}%</strong>
            <ProgressLine value={learningProgress} />
          </div>
          <div className="float-card float-card--students hero__card hero__card--students">
            <strong>Happy Students</strong>
            <small>
              <b>4.5</b> <span>(240)</span> <Icon name="star" />
            </small>
            <AvatarStack avatars={happyStudentAvatars} count={2000} label="happy students" />
          </div>
        </div>
      </Stage>
    </section>
  )
}
