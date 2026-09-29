import { useEffect } from 'react'

const SITE = 'ByteSpace'

/** Sets `document.title` for the current route (WCAG 2.4.2). Pass `undefined` for the bare site title. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Learn Without Limits`
  }, [title])
}
