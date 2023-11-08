import { useContext, useState } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Tab } from 'grommet/es6/components/Tab'
import { useTranslation } from 'react-i18next'
import { Account } from './Account'
import { Wallet } from '../../../../state/wallet/types'
import { Tabs } from 'grommet/es6/components/Tabs'
import { layerOverlayMinHeight } from '../layer'
import { LayerContainer } from './../LayerContainer'
import { ManageableAccountDetails } from './ManageableAccountDetails'

export const ManageableAccount = ({
  wallet,
  isActive,
  deleteWallet,
  selectWallet,
}: {
  wallet: Wallet
  isActive: boolean
  deleteWallet: (address: string) => void
  selectWallet: (address: string) => void
}) => {
  const { t } = useTranslation()
  const [layerVisibility, setLayerVisibility] = useState(false)
  const isMobile = useContext(ResponsiveContext) === 'small'
  const handleDelete = (address: string) => {
    deleteWallet(address)
    setLayerVisibility(false)
  }

  return (
    <>
      <Account
        address={wallet.address}
        balance={wallet.balance}
        onClick={selectWallet}
        isActive={isActive}
        path={wallet.path}
        displayBalance={true}
        displayManageButton={{
          onClickManage: () => setLayerVisibility(true),
        }}
      />
      {layerVisibility && (
        <LayerContainer hideLayer={() => setLayerVisibility(false)}>
          <Tabs alignControls="start">
            <Tab title={t('toolbar.settings.myAccountsTab', 'My Accounts')}>
              <Box
                flex="grow"
                justify="between"
                height={{ min: isMobile ? 'auto' : layerOverlayMinHeight }}
                pad={{ vertical: 'medium' }}
              >
                <ManageableAccountDetails deleteAccount={handleDelete} wallet={wallet} />
                <Box direction="row" justify="between" pad={{ top: 'large' }}>
                  <Button
                    secondary
                    label={t('toolbar.settings.cancel', 'Cancel')}
                    onClick={() => setLayerVisibility(false)}
                  />
                </Box>
              </Box>
            </Tab>
          </Tabs>
        </LayerContainer>
      )}
    </>
  )
}
