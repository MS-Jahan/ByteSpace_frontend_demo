import type { ReactNode, SVGProps } from 'react'

type IconName = 'search' | 'arrow' | 'check' | 'menu' | 'close' | 'eye' | 'star' | 'play' | 'sparkle' | 'mail'

type IconProps = SVGProps<SVGSVGElement> & { name: IconName }

const paths: Record<IconName, ReactNode> = {
  search: <><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4.4 4.4" /></>,
  arrow: <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
  check: <><path d="m5 12 4.3 4.3L19 6.7" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  eye: <><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.6" /></>,
  star: <path d="m12 2 2.9 6 6.6 1-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-1L12 2Z" />,
  play: <path d="m9 6 10 6-10 6V6Z" />,
  sparkle: <><path d="m12 2 1.8 7 7.2 3-7.2 2-1.8 8-2-8-7-2 7-3 2-7Z" /><path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2Z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
}

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  )
}
