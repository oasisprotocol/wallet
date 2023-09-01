/**
 *
 * SettingsButton
 *
 */
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import React, { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAddress, selectHasAccounts } from 'app/state/wallet/selectors'

import { AccountSelector } from '../AccountSelector'
import { JazzIcon } from '../../../JazzIcon'
import { sidebarSmallSizeLogo, sidebarMediumSizeLogo } from '../../../../../styles/theme/elementSizes'
import { addressToJazzIconSeed } from './addressToJazzIconSeed'
import { UserSettings } from 'grommet-icons/es6/icons/UserSettings'
import { ResponsiveLayer } from '../../../ResponsiveLayer'

export const SettingsButton = memo(() => {
  const walletHasAccounts = useSelector(selectHasAccounts)
  const address = useSelector(selectAddress)
  const [layerVisibility, setLayerVisibility] = useState(false)
  const isMobile = React.useContext(ResponsiveContext) === 'small'

  if (!walletHasAccounts) {
    return null
  }

  return (
    <>
      <Button onClick={() => setLayerVisibility(true)} data-testid="account-selector">
        {address ? (
          <JazzIcon
            diameter={isMobile ? sidebarSmallSizeLogo : sidebarMediumSizeLogo}
            seed={addressToJazzIconSeed(address)}
          />
        ) : (
          <UserSettings />
        )}
      </Button>
      {layerVisibility && (
        <ResponsiveLayer
          onClickOutside={() => setLayerVisibility(false)}
          onEsc={() => setLayerVisibility(false)}
          animation="slide"
          background="background-front"
          modal
        >
          <Box margin="medium" width={isMobile ? 'auto' : '700px'}>
            <AccountSelector closeHandler={() => setLayerVisibility(false)} />
          </Box>
        </ResponsiveLayer>
      )}
    </>
  )
})
