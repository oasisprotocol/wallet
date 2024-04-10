declare module '*.png' {
  /** Image URL */
  const url: string
  export default url
}

declare module '*.svg' {
  /** Image URL */
  const url: string
  export default url
}

declare module 'bundle-text:*.svg' {
  /** Image content */
  const content: string
  export default content
}
