/**
 * "Download for use" from Transifex includes English strings for untranslated.
 * "Download file to translate" includes empty strings instead. This removes
 * empty strings and then empty groups. react-i18next will automatically
 * use the English version of the string, if the translation does not exist.
 *
 * Additionally, extract-messages prunes english lang when we remove some
 * translation keys, but it doesn't prune other translations.
 *
 * Usage: `node ./normalize-translations.js ./path/*.json`
 */

const paths = process.argv.slice(2)
const englishPath = paths.find(path => path.includes('/en/translation.json'))
if (!englishPath) throw new Error('Can not find english translation')
const english = JSON.parse(require('fs').readFileSync(englishPath, 'utf-8'))

paths.forEach(path => {
  const translation = JSON.parse(require('fs').readFileSync(path, 'utf-8'))

  pruneTranslation(translation, english)

  const cleanedUpTranslation = JSON.parse(JSON.stringify(translation), (k, v) => {
    if (v === '') return // Remove untranslated "" fields
    if (Object.getPrototypeOf(v) === Object.prototype && Object.keys(v).length === 0) return // Remove empty groups {}
    return v
  })

  require('fs').writeFileSync(path, `${JSON.stringify(cleanedUpTranslation, null, 2)}\n`, 'utf-8')
})

/** Remove keys if they don't appear in english translation */
function pruneTranslation(prunableTranslationObj, englishObj) {
  for (const key in prunableTranslationObj) {
    if (!(key in englishObj)) {
      delete prunableTranslationObj[key]
    } else if (typeof prunableTranslationObj[key] === 'object') {
      pruneTranslation(prunableTranslationObj[key], englishObj[key])
    }
  }
}
