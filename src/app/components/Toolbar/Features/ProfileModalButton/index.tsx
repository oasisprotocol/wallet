/**
 *
 * ProfileModalButton
 *
 */
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
import { Tabs } from 'grommet/es6/components/Tabs'
import { Tab } from 'grommet/es6/components/Tab'
import { useTranslation } from 'react-i18next'
import { Contacts } from '../Contacts'
import { Profile } from '../Profile'
import { Settings } from '../Settings'
import { LayerContainer } from '../LayerContainer'

export const ProfileModalButton = memo(() => {
  const { t } = useTranslation()
  const walletHasAccounts = useSelector(selectHasAccounts)
  const address = useSelector(selectAddress)
  const [layerVisibility, setLayerVisibility] = useState(false)
  const isMobile = React.useContext(ResponsiveContext) === 'small'
  const hideLayer = () => setLayerVisibility(false)

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
        <LayerContainer animation hideLayer={hideLayer}>
          <Tabs>
            <Tab title={t('toolbar.settings.myAccountsTab', 'My Accounts')}>
              <AccountSelector closeHandler={hideLayer} />
            </Tab>
            <Tab data-testid="toolbar-contacts-tab" title={t('toolbar.settings.contacts', 'Contacts')}>
              <Contacts closeHandler={hideLayer} />
            </Tab>
            <Tab data-testid="toolbar-profile-tab" title={t('toolbar.settings.profile', 'Profile')}>
              <Profile closeHandler={hideLayer} />
            </Tab>
            <Tab data-testid="toolbar-contacts-settings" title={t('toolbar.settings.settings', 'Settings')}>
              <Settings />
            </Tab>
          </Tabs>
        </LayerContainer>
      )}
    </>
  )
})
