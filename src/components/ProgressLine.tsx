/** Progress track; the fill width comes from data rather than CSS. */
export function ProgressLine({ value }: { value: number }) {
  return (
    <span className="progress-line">
      <span style={{ width: `${value}%` }} />
    </span>
  )
}
