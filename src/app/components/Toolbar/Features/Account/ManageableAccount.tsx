import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Close } from 'grommet-icons/es6/icons/Close'
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
import { uintToBase64, hex2uint } from '../../../../lib/helpers'
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
        displayBalance={true}
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
          <Box
            margin={{ top: 'small', bottom: 'medium', horizontal: 'medium' }}
            width={isMobile ? 'auto' : '700px'}
          >
            <Box align="end">
              <Button
                data-testid="close-settings-modal"
                onClick={() => setLayerVisibility(false)}
                secondary
                icon={<Close size="18px" />}
              />
            </Box>
            <Tabs alignControls="start">
              <Tab title={t('toolbar.settings.myAccountsTab', 'My Accounts')}>
                <Box margin={{ vertical: 'medium' }}>
                  <AddressBox address={wallet.address} border />
                  <Text size="small" margin={'small'}>
                    <DerivationFormatter pathDisplay={wallet.pathDisplay} type={wallet.type} />
                  </Text>
                </Box>
                <Button
                  label={t('toolbar.settings.exportPrivateKey', 'Export Private Key')}
                  disabled={!wallet.privateKey}
                  onClick={() => {
                    prompt(
                      t('toolbar.settings.exportPrivateKey', 'Export Private Key'),
                      uintToBase64(hex2uint(wallet.privateKey!)),
                    )
                  }}
                />
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
