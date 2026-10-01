/** Deliberately simple: something@something.tld with no spaces. */
export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
