import type { CSSProperties } from 'react'

/** Where an ornament sits, in design pixels of its stage (Figma frame coordinates). */
export type Placement = {
  x: number
  y: number
  w: number
  /** Defaults to `w` (the raw renders are square). */
  h?: number
  /** Overrides for the stacked (<= 960px) layout, as CSS lengths. */
  mobile?: { x?: string; y?: string; w?: string; h?: string; hidden?: boolean }
}

function placementStyle({ x, y, w, h, mobile }: Placement, style?: CSSProperties) {
  return {
    ...style,
    '--x': x,
    '--y': y,
    '--w': w,
    ...(h === undefined ? {} : { '--h': h }),
    ...(mobile?.x === undefined ? {} : { '--mx': mobile.x }),
    ...(mobile?.y === undefined ? {} : { '--my': mobile.y }),
    ...(mobile?.w === undefined ? {} : { '--mw': mobile.w }),
    ...(mobile?.h === undefined ? {} : { '--mh': mobile.h }),
    ...(mobile?.hidden ? { '--md': 'none' } : {}),
  } as CSSProperties
}

type Loading = 'eager' | 'lazy'

/** Shapes hidden on the stacked layout are lazy so `display: none` keeps the browser from fetching them. */
function loadingFor(placement: Placement, loading?: Loading): Loading {
  return placement.mobile?.hidden ? 'lazy' : (loading ?? 'eager')
}

type Shape3DProps = {
  /** Uncropped grey 3D render from `public/assets`. */
  src: string
  /** The design tints each render with a hard-light lime or near-white layer. */
  tint: 'lime' | 'white'
  placement: Placement
  /** Defaults to eager, or lazy for shapes hidden on the stacked layout. */
  loading?: Loading
  className?: string
  style?: CSSProperties
}

/**
 * A decorative 3D render tinted the way the Figma file does it: a solid layer in
 * `hard-light` blend mode, clipped to the render's own silhouette. Used for the
 * shapes the design crops at a frame edge, so the whole render stays available
 * and the section's own `overflow: clip` does the cropping.
 */
export function Shape3D({ src, tint, placement, loading, className = '', style }: Shape3DProps) {
  return (
    <span
      aria-hidden="true"
      className={`shape3d shape3d--${tint} ornament ${className}`.trim()}
      style={{ ...placementStyle(placement, style), '--shape': `url(${src})` } as CSSProperties}
    >
      <img src={src} alt="" loading={loadingFor(placement, loading)} decoding="async" />
    </span>
  )
}

type BakedShapeProps = {
  /** Figma render with the tint already applied (`public/assets/shapes`). */
  src: string
  placement: Placement
  loading?: Loading
  className?: string
  style?: CSSProperties
}

/** A pre-tinted shape, placed from the render bounds recorded in `assets-manifest.json`. */
export function BakedShape({ src, placement, loading, className = '', style }: BakedShapeProps) {
  return (
    <img
      aria-hidden="true"
      className={`ornament ${className}`.trim()}
      style={placementStyle(placement, style)}
      src={src}
      alt=""
      loading={loadingFor(placement, loading)}
      decoding="async"
    />
  )
}
