/**
 * Copyright 2024 https://github.com/google/material-design-icons
 * SPDX-License-Identifier: Apache-2.0
 */

import { Blank } from 'grommet-icons/es6/icons/Blank'
/* eslint-disable-next-line no-restricted-imports */
import { IconProps } from 'grommet-icons/es6/icons'
import { useTranslation } from 'react-i18next'

// https://github.com/google/material-design-icons/blob/6579dc142e9e2ec05df194c6541d3a951fe773e3/symbols/web/wallet/materialsymbolsoutlined/wallet_24px.svg
export const MuiWalletIcon = (props: IconProps) => {
  const { t } = useTranslation()

  return (
    <Blank aria-label={t('icons.wallet.label', 'Wallet')} viewBox="0 -960 960 960" {...props}>
      <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z" />
    </Blank>
  )
}
