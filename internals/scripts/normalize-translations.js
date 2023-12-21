/**
 * "Download for use" from Transifex includes English strings for untranslated.
 * "Download file to translate" includes empty strings instead. This removes
 * empty strings and then empty groups. react-i18next will automatically
 * use the English version of the string, if the translation does not exist.
 *
 * Usage: `node ./normalize-translations.js ./path/*.json`
 */

const paths = process.argv.slice(2)
paths.forEach(path => {
  const translationStr = require('fs').readFileSync(path, 'utf-8')

  const cleanedUpTranslation = JSON.stringify(
    JSON.parse(translationStr, (k, v) => {
      if (v === '') return // Remove untranslated "" fields
      if (Object.getPrototypeOf(v) === Object.prototype && Object.keys(v).length === 0) return // Remove empty groups {}
      return v
    }),
    null,
    2,
  )

  require('fs').writeFileSync(path, `${cleanedUpTranslation}\n`, 'utf-8')
})
