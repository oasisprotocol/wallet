/**
 *
 * ProfileModalButton
 *
 */
import { useNavigate } from 'react-router-dom'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Lock } from 'grommet-icons/es6/icons/Lock'
import { Logout } from 'grommet-icons/es6/icons/Logout'
import React, { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAddress, selectHasAccounts } from 'app/state/wallet/selectors'
import { selectIsLockableOrCloseable } from 'app/state/selectIsLockableOrCloseable'
import { persistActions } from 'app/state/persist'
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
import { ButtonLink } from '../../../ButtonLink'
import { Add } from 'grommet-icons/es6/icons/Add'

export const ProfileModalButton = memo(() => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLockableOrCloseable = useSelector(selectIsLockableOrCloseable)
  const walletHasAccounts = useSelector(selectHasAccounts)
  const address = useSelector(selectAddress)
  const [layerVisibility, setLayerVisibility] = useState(false)
  const isMobile = React.useContext(ResponsiveContext) === 'small'
  const hideLayer = () => setLayerVisibility(false)
  const closeWallet = () => {
    navigate('/')
    dispatch(persistActions.lockAsync())
  }
  const lockProfile = () => {
    dispatch(persistActions.lockAsync())
  }

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
          {isMobile && (
            <Box direction="row" justify="between" margin={{ top: 'large', bottom: 'medium' }} gap="medium">
              <ButtonLink
                icon={<Add a11yTitle={undefined} />}
                label={t('menu.addAccounts', 'Add accounts')}
                to="/"
                onClick={() => hideLayer()}
              />
              {isLockableOrCloseable === 'closeable' && (
                <Button
                  data-testid="profile-modal-close-wallet"
                  icon={<Logout />}
                  label={t('menu.closeWallet', 'Close wallet')}
                  onClick={() => closeWallet()}
                />
              )}
              {isLockableOrCloseable === 'lockable' && (
                <Button
                  data-testid="profile-modal-lock-wallet"
                  icon={<Lock />}
                  label={t('menu.lockProfile', 'Lock profile')}
                  onClick={() => lockProfile()}
                />
              )}
            </Box>
          )}
        </LayerContainer>
      )}
    </>
  )
})
