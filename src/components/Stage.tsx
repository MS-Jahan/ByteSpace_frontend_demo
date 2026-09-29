import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type StageProps = {
  /** Design-size box in CSS pixels (from the Figma frame). */
  width: number
  height: number
  className?: string
  /** Hides purely visual art from assistive technology. */
  decorative?: boolean
  /**
   * Simplified replacement for narrow screens. Scaling a 500px+ composition
   * into a ~350px column shrinks its text below legibility, so callers can
   * restage the art (absolute positions still come from the design grid).
   */
  mobile?: ReactNode
  children: ReactNode
}

/**
 * A fixed design-size composition that scales down to fit its container.
 * Children are positioned in design pixels; the stage keeps their relative
 * positions at every width, so overlapping art never drifts apart. It never
 * scales up: wider containers keep the design size and centre it.
 *
 * `--s` (0-1) is exposed on the element for anything that needs the factor.
 */
export function Stage({ width, height, className = '', decorative = false, mobile, children }: StageProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    let lastScale = ''
    let raf = 0
    const update = () => {
      // A shrink-to-fit parent can leave the stage 0px wide; falling back to the
      // parent keeps the composition scaled to the space it actually sits in
      // instead of drawing at full size and getting cropped.
      const own = element.clientWidth
      const available = own > 0 ? own : (element.parentElement?.clientWidth ?? width)
      const scale = available > 0 ? Math.min(1, available / width) : 1
      const next = scale.toFixed(4)
      // Skip redundant writes; writing layout-affecting styles synchronously
      // inside the observer's delivery window makes WebKit report a
      // "ResizeObserver loop" page error even when nothing changed.
      if (next === lastScale) return
      lastScale = next
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => element.style.setProperty('--s', next))
    }
    update()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', update)
      }
    }
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [width])

  return (
    <div
      ref={ref}
      className={`stage ${className}`.trim()}
      aria-hidden={decorative || undefined}
      style={{ '--stage-w': width, '--stage-h': height } as CSSProperties}
    >
      <div className="stage__inner">{children}</div>
      {mobile !== undefined && <div className="stage__mobile">{mobile}</div>}
    </div>
  )
}
