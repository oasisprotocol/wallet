import { Buffer } from 'buffer'

globalThis.Buffer = Buffer
window.global = globalThis

/**
 * Fix unsafe-eval CSP violation with regenerator
 * https://stephencharlesweiss.com/unsafe-eval-regenerator-runtime
 */
globalThis.regeneratorRuntime = undefined
