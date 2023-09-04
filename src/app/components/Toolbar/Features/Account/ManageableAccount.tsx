import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Tab } from 'grommet/es6/components/Tab'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from './Account'
import { Wallet } from '../../../../state/wallet/types'
import { ResponsiveLayer } from '../../../ResponsiveLayer'
import { Tabs } from 'grommet/es6/components/Tabs'
import { DerivationFormatter } from './DerivationFormatter'
import { AddressBox } from '../../../AddressBox'

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
        displayManageButton={{
          onClickManage: () => setLayerVisibility(true),
        }}
      />
      {layerVisibility && (
        <ResponsiveLayer
          onClickOutside={() => setLayerVisibility(false)}
          onEsc={() => setLayerVisibility(false)}
          animation="none"
          background="background-front"
          modal
          position="top"
          margin={isMobile ? 'none' : 'xlarge'}
        >
          <Box margin="medium" width={isMobile ? 'auto' : '700px'}>
            <Tabs alignControls="start">
              <Tab title={t('toolbar.settings.myAccountsTab', 'My Accounts')}>
                <Box margin={{ vertical: 'medium' }}>
                  <AddressBox address={wallet.address} border />
                  <Text size="small" margin={'small'}>
                    <DerivationFormatter pathDisplay={wallet.pathDisplay} type={wallet.type} />
                  </Text>
                </Box>
                <Box direction="row" justify="between" pad={{ top: 'large' }}>
                  <Button
                    secondary
                    label={t('toolbar.settings.cancel', 'Cancel')}
                    onClick={() => setLayerVisibility(false)}
                  />
                </Box>
              </Tab>
            </Tabs>
          </Box>
        </ResponsiveLayer>
      )}
    </>
  )
}
