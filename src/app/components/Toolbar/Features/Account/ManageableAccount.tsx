import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { FormField } from 'grommet/es6/components/FormField'
import { Tab } from 'grommet/es6/components/Tab'
import { Text } from 'grommet/es6/components/Text'
import { TextInput } from 'grommet/es6/components/TextInput'
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
          <Box margin="medium" width={isMobile ? 'auto' : '700px'}>
            <Tabs alignControls="start">
              <Tab title={t('toolbar.settings.myAccountsTab', 'My Accounts')}>
                <Box margin={{ vertical: 'medium' }}>
                  <FormField
                    name="name"
                    required
                    validate={(name: string) =>
                      name.trim().length > 16
                        ? {
                            message: t('toolbar.settings.nameLengthError', 'No more than 16 characters'),
                            status: 'error',
                          }
                        : undefined
                    }
                  >
                    <TextInput
                      name="name"
                      placeholder={t('toolbar.settings.optionalName', 'Name (optional)')}
                    />
                  </FormField>
                </Box>
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
