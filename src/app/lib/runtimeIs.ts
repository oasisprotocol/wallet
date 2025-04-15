import { Capacitor } from '@capacitor/core'

// https://github.com/mozilla/webextension-polyfill/blob/6e3e26c/src/browser-polyfill.js#L9

export const runtimeIs = Capacitor.isNativePlatform()
  ? 'mobile-app'
  : (globalThis as any).chrome?.runtime?.id
  ? 'extension'
  : 'webapp'
