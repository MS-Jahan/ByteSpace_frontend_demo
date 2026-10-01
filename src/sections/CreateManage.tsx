import { AvatarStack } from '../components/AvatarStack'
import { Icon } from '../components/Icons'
import { ProgressLine } from '../components/ProgressLine'
import { BakedShape } from '../components/Shape3D'
import { Stage } from '../components/Stage'
import { happyStudentAvatars, learningProgress } from '../data'

const checklist = ['Share Your Expertise', 'Monetize Your Passion', 'Flexibility and Autonomy', 'Build a Community']

export function CreateManage() {
  return (
    <section className="create" id="creators">
      <div className="container create__layout">
        {/* Decorative: the figures are illustrative. Art in Figma pixels. Layers: revenue cards, the woman, then the students card and squiggle. */}
        <Stage
          width={561}
          height={596}
          className="create__art"
          decorative
          // Narrow phones: a static restage instead of scaling the whole
          // composition (its 10px labels would shrink to ~6px).
          mobile={
            <div className="create__m-art">
              <div className="revenue-card revenue-card--month create__m-revenue">
                <small>Total Revenue</small>
                <span>July 1-28</span>
                <strong>$120.29</strong>
                <ProgressLine value={learningProgress} />
              </div>
              <div className="create__m-person">
                <img src="/assets/cutouts/create-person.png" alt="" loading="lazy" />
              </div>
              <div className="float-card float-card--students create__m-students">
                <strong>Happy Students</strong>
                <small>
                  <b>4.5</b> <span>(240)</span> <Icon name="star" />
                </small>
                <AvatarStack avatars={happyStudentAvatars} count={2000} label="happy students" />
              </div>
            </div>
          }
        >
          <div className="revenue-card revenue-card--month">
            <small>Total Revenue</small>
            <span>July 1-28</span>
            <strong>$120.29</strong>
            <ProgressLine value={learningProgress} />
          </div>
          <div className="revenue-card revenue-card--year">
            <small>Year to Date</small>
            <span>2023</span>
            <strong>$1,200.38</strong>
            <span className="revenue-card__delta">+12$</span>
          </div>
          <div className="create__person">
            <img src="/assets/cutouts/create-person.png" alt="" loading="lazy" />
          </div>
          <BakedShape
            className="create__squiggle"
            src="/assets/shapes/home-create-lime-squiggle-b.png"
            placement={{ x: 304, y: 114, w: 216, h: 216 }}
          />
          <div className="float-card float-card--students create__students">
            <strong>Happy Students</strong>
            <small>
              <b>4.5</b> <span>(240)</span> <Icon name="star" />
            </small>
            <AvatarStack avatars={happyStudentAvatars} count={2000} label="happy students" />
          </div>
        </Stage>

        <div className="create__copy">
          <h2>Create &amp; Manage Courses Easily.</h2>
          <p className="body-copy">
            <strong>ByteSpace</strong> supports individuals or entities in the creation, publication, and administration
            of educational courses.
          </p>
          <ul className="check-list">
            {checklist.map((item) => (
              <li key={item}>
                <Icon name="checkCircle" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
