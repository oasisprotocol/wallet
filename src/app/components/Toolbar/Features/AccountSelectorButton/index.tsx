/**
 *
 * AccountSelectorButton
 *
 */
import { Button } from 'grommet/es6/components/Button'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import React, { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAddress } from 'app/state/wallet/selectors'

import { AccountSelector } from '../AccountSelector'
import { JazzIcon } from '../../../JazzIcon'
import { smallSizeLogo, mediumSizeLogo } from '../../../Sidebar'
import { addressToJazzIconSeed } from './addressToJazzIconSeed'

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
        <JazzIcon
          diameter={isMobile ? smallSizeLogo : mediumSizeLogo}
          seed={addressToJazzIconSeed(address)}
        />
      </Button>
      {layerVisibility && <AccountSelector closeHandler={() => setLayerVisibility(false)} />}
    </>
  )
})
