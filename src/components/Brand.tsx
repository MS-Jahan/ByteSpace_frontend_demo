type BrandProps = {
  light?: boolean
  compact?: boolean
}

export function Brand({ light = false, compact = false }: BrandProps) {
  return (
    <a className={`brand${light ? ' brand--light' : ''}${compact ? ' brand--compact' : ''}`} href="/" aria-label="ByteSpace home">
      <svg className="brand__mark" viewBox="0 0 29 32" role="img" aria-label="">
        <path d="M10.5 10.5C10.5 4.701 5.799 0 0 0v21c0 5.799 4.701 10.5 10.5 10.5v-21Z" />
        <path d="M18.375 10.5C24.174 10.5 28.875 15.201 28.875 21H21C15.201 21 10.5 16.299 10.5 10.5h7.875Z" />
        <path d="M18.375 31.5C24.174 31.5 28.875 26.799 28.875 21H21c-5.799 0-10.5 4.701-10.5 10.5h7.875Z" />
      </svg>
      <span className="brand__name">ByteSpace</span>
    </a>
  )
}
