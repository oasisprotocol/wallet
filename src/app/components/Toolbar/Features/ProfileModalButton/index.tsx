/**
 *
 * ProfileModalButton
 *
 */
import { useNavigate } from 'react-router-dom'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Close } from 'grommet-icons/es6/icons/Close'
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
import { ResponsiveLayer } from '../../../ResponsiveLayer'
import { Tabs } from 'grommet/es6/components/Tabs'
import { Tab } from 'grommet/es6/components/Tab'
import { useTranslation } from 'react-i18next'
import { Contacts } from '../Contacts'
import { Profile } from '../Profile'
import { Settings } from '../Settings'

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
  const handleOnActive = (index: number) => {
    // when Lock/Close tab is clicked
    if (index === 4) {
      navigate('/')
      dispatch(persistActions.lockAsync())
    }
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
        <ResponsiveLayer
          onClickOutside={hideLayer}
          onEsc={hideLayer}
          animation="slide"
          background="background-front"
          modal
          position="top"
          margin={isMobile ? 'none' : 'xlarge'}
        >
          <Box
            margin={{ top: 'small', bottom: 'medium', horizontal: 'medium' }}
            width={isMobile ? 'auto' : '700px'}
          >
            <Box align="end">
              <Button
                data-testid="close-settings-modal"
                onClick={hideLayer}
                secondary
                icon={<Close size="18px" />}
              />
            </Box>
            <Tabs alignControls="start" onActive={handleOnActive}>
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
              {(isLockableOrCloseable === 'closeable' || isLockableOrCloseable === 'lockable') &&
                isMobile && (
                  <Tab
                    title={
                      isLockableOrCloseable === 'closeable'
                        ? t('toolbar.settings.closeWallet', 'Close Wallet')
                        : t('toolbar.settings.lock', 'Lock')
                    }
                  ></Tab>
                )}
            </Tabs>
          </Box>
        </ResponsiveLayer>
      )}
    </>
  )
})
