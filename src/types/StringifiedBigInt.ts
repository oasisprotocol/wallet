/** Redux can't serialize bigint fields, so we stringify them, and mark them. */
export type StringifiedBigInt = string & PreserveAliasName
interface PreserveAliasName extends String {}

// Hover to check if inferred variable type is StringifiedBigInt (not string)
export const testPreserveAliasName = '0' as StringifiedBigInt
