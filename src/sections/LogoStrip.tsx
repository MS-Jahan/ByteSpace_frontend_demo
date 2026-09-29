const logos = [
  { src: '/assets/icons/logo-partner-1.svg', width: 167, height: 41 },
  { src: '/assets/icons/logo-partner-2.svg', width: 168, height: 41 },
  { src: '/assets/icons/logo-partner-3.svg', width: 170, height: 41 },
  { src: '/assets/icons/logo-partner-4.svg', width: 170, height: 41 },
  { src: '/assets/icons/logo-partner-5.svg', width: 169, height: 42 },
]

/** The design's five placeholder partner marks ("Logoipsum"), as exported from Figma. */
export function LogoStrip() {
  return (
    <section className="logo-strip">
      <div className="container">
        <ul className="partner-logos" aria-hidden="true">
          {logos.map((logo) => (
            <li key={logo.src}>
              <img src={logo.src} alt="" width={logo.width} height={logo.height} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
