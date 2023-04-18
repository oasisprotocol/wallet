const dateFormat = new Intl.DateTimeFormat(process?.env?.NODE_ENV === 'test' ? 'en-US' : undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZone: process?.env?.NODE_ENV === 'test' ? 'UTC' : undefined,
})

/**
 * Narrow No-Brake Space
 *
 * This is used by the date formatter.
 * See https://unicodeplus.com/U+202F
 */
const NNBSP = '\u202F'

export const intlDateTimeFormat = (date: Date | number) => dateFormat.format(date).replaceAll(NNBSP, ' ')
