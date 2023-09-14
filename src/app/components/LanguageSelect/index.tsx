import { useTranslation } from 'react-i18next'
import { FormField } from 'grommet/es6/components/FormField'
import { Select } from 'grommet/es6/components/Select'
import { Language } from 'styles/theme/icons/language/Language'
import { SelectIconWrapper } from '../SelectIconWrapper'
import { languageLabels } from '../../../locales/i18n'

const languageOptions = languageLabels.map(lang => ({ value: lang[0], label: lang[1] }))

export const LanguageSelect = () => {
  const { t, i18n } = useTranslation()

  return (
    <FormField label={t('language', 'Language')} contentProps={{ border: false }}>
      <SelectIconWrapper icon={<Language />}>
        <Select
          id="language"
          name="language"
          labelKey="label"
          valueKey={{ key: 'value', reduce: true }}
          style={{ paddingLeft: '50px' }}
          value={i18n.language}
          options={languageOptions}
          onChange={({ option }) => i18n.changeLanguage(option.value)}
        />
      </SelectIconWrapper>
    </FormField>
  )
}
