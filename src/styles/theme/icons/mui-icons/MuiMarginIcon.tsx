import { useTranslation } from 'react-i18next'
import { Blank } from 'grommet-icons/es6/icons/Blank'
/* eslint-disable-next-line no-restricted-imports */
import { IconProps } from 'grommet-icons/es6/icons'

// From https://github.com/mui/material-ui/blob/4c336b8bd492749117a34947db44b0157a44c18b/packages/mui-icons-material/lib/esm/Margin.js#L6
export const MuiMarginIcon = (props: IconProps) => {
  const { t } = useTranslation()

  return (
    <Blank aria-hidden={undefined} aria-label={t('icons.mnemonic', 'Mnemonic')} {...props}>
      <path d="M3 3v18h18V3zm16 16H5V5h14zM11 7h2v2h-2zM7 7h2v2H7zm8 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
    </Blank>
  )
}
