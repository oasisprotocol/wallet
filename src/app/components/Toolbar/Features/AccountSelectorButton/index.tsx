/**
 *
 * AccountSelectorButton
 *
 */
import { Button, ResponsiveContext } from 'grommet'
import React, { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { staking } from '@oasisprotocol/client'
import { selectAddress } from 'app/state/wallet/selectors'

import { AccountSelector } from '../AccountSelector'
import { JazzIcon } from '../../../JazzIcon'
import { smallSizeLogo, mediumSizeLogo } from '../../../Sidebar'

export const addressToNumber = (address: string) => {
  // https://github.com/oasisprotocol/oasis-wallet-ext/blob/da7ad67/src/popup/component/AccountIcon/index.js#L26
  const addressU8 = staking.addressFromBech32(address)
  const seed = addressU8[20] | (addressU8[19] << 8) | (addressU8[18] << 16) | (addressU8[17] << 24)

  return seed
}

export const AccountSelectorButton = memo(() => {
  const address = useSelector(selectAddress)
  const [layerVisibility, setLayerVisibility] = useState(false)
  const isMobile = React.useContext(ResponsiveContext) === 'small'

  if (!address) {
    return null
  }

  return (
    <>
      <Button onClick={() => setLayerVisibility(true)}>
        <JazzIcon diameter={isMobile ? smallSizeLogo : mediumSizeLogo} seed={addressToNumber(address)} />
      </Button>
      {layerVisibility && <AccountSelector closeHandler={() => setLayerVisibility(false)} />}
    </>
  )
})
