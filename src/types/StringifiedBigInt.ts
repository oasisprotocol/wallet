/**
 * BigInt as a string.
 *
 * Redux can't serialize bigint fields, so we stringify them, and mark them.
 * TODO: make this a branded type, that only works with bigint parsing utils.
 */
export type StringifiedBigInt = string & PreserveAliasName

interface PreserveAliasName extends String {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testKeepAliasName: { amount: StringifiedBigInt } = {
  // Hover "amount" to check that the displayed type is StringifiedBigInt (not string)
  amount: 10n.toString(),
}
