import { useContext, useState } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Tab } from 'grommet/es6/components/Tab'
import { Text } from 'grommet/es6/components/Text'
import { useTranslation } from 'react-i18next'
import { Account } from './Account'
import { Wallet } from '../../../../state/wallet/types'
import { Tabs } from 'grommet/es6/components/Tabs'
import { DerivationFormatter } from './DerivationFormatter'
import { uintToBase64, hex2uint } from '../../../../lib/helpers'
import { AddressBox } from '../../../AddressBox'
import { layerOverlayMinHeight } from '../layer'
import { LayerContainer } from './../LayerContainer'

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
                <Box>
                  <AddressBox address={wallet.address} border />
                  <Text size="small" margin={'small'}>
                    <DerivationFormatter pathDisplay={wallet.pathDisplay} type={wallet.type} />
                  </Text>
                  <Button
                    alignSelf="start"
                    label={t('toolbar.settings.exportPrivateKey', 'Export Private Key')}
                    disabled={!wallet.privateKey}
                    onClick={() => {
                      prompt(
                        t('toolbar.settings.exportPrivateKey', 'Export Private Key'),
                        uintToBase64(hex2uint(wallet.privateKey!)),
                      )
                    }}
                  />
                </Box>
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
