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
  onClick,
}: {
  wallet: Wallet
  isActive: boolean
  onClick: (address: string) => void
}) => {
  const { t } = useTranslation()
  const [layerVisibility, setLayerVisibility] = useState(false)
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <>
      <Account
        address={wallet.address}
        balance={wallet.balance}
        onClick={onClick}
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
                <ManageableAccountDetails wallet={wallet} />
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
