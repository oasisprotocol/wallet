import { Trans, useTranslation } from 'react-i18next'

/**
 * This type-only test doesn't need to run, it just needs to be compiled. It
 * checks that CustomTypeOptions in react-i18next.d.ts add type-safety to
 * string-based translation keys.
 */
export function TypeOnlyTestTranslationKeys() {
  const { t } = useTranslation()

  return (
    <div>
      {t('menu.home')}
      {t('menu.home', 'Default')}
      <Trans i18nKey="menu.home" t={t} />
      <Trans i18nKey="menu.home" t={t} defaults="Default" />

      {/* @ts-expect-error Expect typescript to detect incorrect key */}
      {t('menu.does_not_exist')}
      {/* @ts-expect-error Expect typescript to detect incorrect key */}
      {t('menu.does_not_exist', 'Default')}
      {/* @ts-expect-error Expect typescript to detect incorrect key */}
      <Trans i18nKey="menu.does_not_exist" t={t} />
      {/* @ts-expect-error Expect typescript to detect incorrect key */}
      <Trans i18nKey="menu.does_not_exist" t={t} defaults="Default" />
    </div>
  )
}
