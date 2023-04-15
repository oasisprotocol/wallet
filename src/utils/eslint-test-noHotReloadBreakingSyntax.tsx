/**
 * @file
 * ESLint should detect fast-refresh limitation
 * https://parceljs.org/recipes/react/#fast-refresh
 * > Export only React components – If a file exports a mix of React components
 * > and other types of values, its state will be reset whenever it changes. To
 * > preserve state, only export React components and move other exports to a
 * > different file if possible.
 *
 * Using ESLint's disable directives with reportUnusedDisableDirectives, so
 * these work like "expect eslint error".
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo } from 'react'

export const GoodConstComponent = () => <span>good</span>
export const GoodConstMemoComponent = memo(() => <span>good</span>)
export function GoodFunctionComponent() {
  const aa = 'good'
  return <span>good</span>
}
export type goodExportedType = string
export interface goodExportedInterface {
  a: string
}

// Non-exported things are also fine
const goodNotExportedConst = 'good'
function goodNotExportedFunction() {}
type goodNotExportedType = string

// Don't allow exporting values
// eslint-disable-next-line no-restricted-syntax
export const badConst = 'bad'
// eslint-disable-next-line no-restricted-syntax
export const BAD_CONST = 'bad'
// eslint-disable-next-line no-restricted-syntax
export let badLet = 'bad'
badLet = '1'
// eslint-disable-next-line no-restricted-syntax
export function badFunction() {}
