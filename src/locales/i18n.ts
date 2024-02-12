import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import de from './de/translation.json'
import en from './en/translation.json'
import es from './es/translation.json'
import fr from './fr/translation.json'
import sl from './sl/translation.json'
import tr from './tr/translation.json'
import zh_CN from './zh_CN/translation.json'

export const translationsJson = {
  de: {
    translation: de,
  },
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  sl: {
    translation: sl,
  },
  tr: {
    translation: tr,
  },
  zh_CN: {
    translation: zh_CN,
  },
}

export type LanguageKey = keyof typeof translationsJson

export const languageLabels: [LanguageKey, string][] = [
  ['en', 'English'],
  ['de', 'Deutsch'],
  ['es', 'Español'],
  ['fr', 'Français'],
  ['sl', 'Slovenščina'],
  ['tr', 'Türkçe'],
  ['zh_CN', '中文'],
]

export const i18n = i18next
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: translationsJson,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      // Fix Google Translate issue: https://github.com/facebook/react/issues/11538#issuecomment-390386520
      // Fix from https://react.i18next.com/latest/trans-component#i18next-options
      transWrapTextNodes: 'span',
    },
  })
