export function trimLongString(value: string, trimStart = 10, trimEnd = 8) {
  const trimmedLength = trimStart + 3 + trimEnd
  if (trimmedLength > value.length) {
    // If the "trimmed" version would be longer, don't bother
    // (This also covers the case when the length is et most trimStart)
    return value
  }

  return `${value.slice(0, trimStart)}...${value.slice(-trimEnd)}`
}
