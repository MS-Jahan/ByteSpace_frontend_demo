import { cardAvatars } from '../data'

/** 26 -> "26+", 2000 -> "2K+". */
function formatCount(count: number) {
  return count >= 1000 ? `${Math.floor(count / 1000)}K+` : `${count}+`
}

type AvatarStackProps = {
  /** Face images; defaults to the four faces on every course card. */
  avatars?: string[]
  /** Number shown in the lime disc, for example 26 or 2000. */
  count?: number
  label?: string
}

export function AvatarStack({ avatars = cardAvatars, count = 26, label = 'learners' }: AvatarStackProps) {
  const text = formatCount(count)
  return (
    <span className="avatar-stack">
      {avatars.map((src) => (
        <img key={src} src={src} alt="" loading="lazy" />
      ))}
      <span className="avatar-stack__count" aria-hidden="true">
        {text}
      </span>
      <span className="sr-only">
        {text} enrolled {label}
      </span>
    </span>
  )
}
