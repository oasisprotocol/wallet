import { useTranslation } from 'react-i18next'
import { Blank } from 'grommet-icons/es6/icons/Blank'
/* eslint-disable-next-line no-restricted-imports */
import { IconProps } from 'grommet-icons/es6/icons'

// From https://github.com/mui/material-ui/blob/4c336b8bd492749117a34947db44b0157a44c18b/packages/mui-icons-material/lib/esm/Bluetooth.js#L6
export const MuiBluetoothIcon = (props: IconProps) => {
  const { t } = useTranslation()

  return (
    <Blank aria-hidden={undefined} aria-label={t('icons.bluetooth', 'Bluetooth')} {...props}>
      <path d="M17.71 7.71 12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29zM13 5.83l1.88 1.88L13 9.59zm1.88 10.46L13 18.17v-3.76z" />
    </Blank>
  )
}
