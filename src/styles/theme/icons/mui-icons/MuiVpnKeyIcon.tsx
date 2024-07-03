import { useTranslation } from 'react-i18next'
import { Blank } from 'grommet-icons/es6/icons/Blank'
/* eslint-disable-next-line no-restricted-imports */
import { IconProps } from 'grommet-icons/es6/icons'

// From https://github.com/mui/material-ui/blob/4c336b8bd492749117a34947db44b0157a44c18b/packages/mui-icons-material/lib/esm/VpnKey.js#L6
export const MuiVpnKeyIcon = (props: IconProps) => {
  const { t } = useTranslation()

  return (
    <Blank aria-hidden={undefined} aria-label={t('icons.privateKey', 'Private key')} {...props}>
      <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2"></path>
    </Blank>
  )
}
