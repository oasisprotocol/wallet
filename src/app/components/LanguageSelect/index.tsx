import { useTranslation } from 'react-i18next'
import { Language } from 'styles/theme/icons/language/Language'
import { SelectWithIcon } from '../SelectWithIcon'
import { languageLabels, translationsJson } from '../../../locales/i18n'

const languageOptions: { value: keyof typeof translationsJson; label: string }[] = languageLabels.map(
  lang => ({
    value: lang[0],
    label: lang[1],
  }),
)

type LanguageSelectProps = {
  withLabel?: boolean
}

export const LanguageSelect = ({ withLabel }: LanguageSelectProps) => {
  const { t, i18n } = useTranslation()

  return (
    <SelectWithIcon
      icon={<Language />}
      id="language"
      label={withLabel ? t('language', 'Language') : ''}
      name="language"
      onChange={option => i18n.changeLanguage(option)}
      options={languageOptions}
      value={i18n.language}
    />
  )
}
