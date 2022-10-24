import 'i18next'
import en from './en/translation.json'

// Enable intellisense of translation keys
// Note: this may slow down compilation. If performance gets too bad, remove it.
// https://react.i18next.com/latest/typescript#create-a-declaration-file
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en
    }
  }
}
