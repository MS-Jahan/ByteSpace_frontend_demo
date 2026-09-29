import { usePageTitle } from '../usePageTitle'

const sections = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    body: 'ByteSpace is a front-end demonstration. This site has no backend, sets no cookies, and sends no analytics or form data anywhere. Anything you type into a form stays in your browser tab and disappears on reload.',
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    body: 'The courses, prices, creators, and reviews on this site are sample content taken from a design exercise. Nothing here is a real product, offer, or contract, and no payment can be made.',
  },
  {
    id: 'cookies',
    title: 'Cookies Settings',
    body: 'There are no cookies to configure. If this prototype is ever connected to a real service, this page should be replaced with a proper consent and cookie-management interface.',
  },
  {
    id: 'contact',
    title: 'Contact',
    body: 'No contact channel is wired up in this demo. The real ByteSpace project would route enquiries to a support inbox from here.',
  },
  {
    id: 'help',
    title: 'Help',
    body: 'Every control on this site works locally: search, filters, sorting, pagination, follow, enrolment, and the login and signup forms all give immediate feedback without contacting a server.',
  },
]

export function LegalPage() {
  usePageTitle('Policies')
  return (
    <>
      <section className="legal-hero">
        <div className="grid-overlay" aria-hidden="true" />
        <div className="container legal-hero__content">
          <h1>ByteSpace policies</h1>
          <p>Placeholder pages so every footer link resolves inside this front-end prototype.</p>
        </div>
      </section>
      <section className="section legal">
        <div className="container legal__body">
          {sections.map((section) => (
            <article id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
