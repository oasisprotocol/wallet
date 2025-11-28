import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { FormField } from 'grommet/es6/components/FormField'
import { Tab } from 'grommet/es6/components/Tab'
import { Tabs } from 'grommet/es6/components/Tabs'
import { Text } from 'grommet/es6/components/Text'
import { TextInput } from 'grommet/es6/components/TextInput'
import { Tip } from 'grommet/es6/components/Tip'
import { CircleInformation } from 'grommet-icons/es6/icons/CircleInformation'
import { Trans, useTranslation } from 'react-i18next'
import { Wallet, WalletType } from '../../../../state/wallet/types'
import { DerivationFormatter } from './DerivationFormatter'
import { AddressBox } from '../../../AddressBox'
import { LayerContainer } from './../LayerContainer'
import { DeleteAccount } from './DeleteAccount'
import { PrivateKeyFormatter } from '../../../PrivateKeyFormatter'
import { RevealOverlayButton } from '../../../RevealOverlayButton'
import styled from 'styled-components'
import { walletActions } from '../../../../state/wallet'
import { useDispatch } from 'react-redux'

interface FormValue {
  name: string
}

interface ManageableAccountDetailsProps {
  animation?: boolean
  closeHandler: () => void
  closeParentHandler?: () => void
  /** If undefined: delete button is disabled */
  deleteAccount: undefined | ((address: string) => void)
  editAccount?: (name: string) => void
  wallet: Wallet
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
` as typeof Form

const StyledDeleteButton = styled(Button).attrs({
  plain: true,
  color: 'status-error',
})`
  text-align: center;
`

export const ManageableAccountDetails = ({
  animation,
  closeHandler,
  closeParentHandler,
  deleteAccount,
  editAccount,
  wallet,
}: ManageableAccountDetailsProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [value, setValue] = useState({ name: wallet.name || '' })
  const [layerVisibility, setLayerVisibility] = useState(false)
  const [deleteLayerVisibility, setDeleteLayerVisibility] = useState(false)
  const hideLayer = () => {
    setLayerVisibility(false)
  }

  return (
    <>
      <LayerContainer animation={animation} hideLayer={closeHandler}>
        <Tabs>
          <Tab title={t('toolbar.settings.myAccountsTab', 'My Accounts')}>
            <StyledForm<FormValue>
              onSubmit={({ value }) => {
                if (!editAccount) {
                  return
                }
                editAccount(value.name)
                closeHandler()
              }}
              value={value}
              onChange={nextValue => setValue(nextValue)}
            >
              <Box gap="medium">
                <FormField
                  disabled={!editAccount}
                  info={
                    !editAccount ? (
                      <span>
                        <Trans
                          i18nKey="toolbar.settings.accountNamingNotAvailable"
                          t={t}
                          components={{
                            OpenWalletButton: (
                              <Button
                                color="link"
                                onClick={() => {
                                  closeParentHandler ? closeParentHandler() : closeHandler()
                                  navigate('/open-wallet')
                                }}
                              />
                            ),
                          }}
                          defaults="To name your account create a profile while <OpenWalletButton>opening a wallet</OpenWalletButton>."
                        />
                      </span>
                    ) : undefined
                  }
                  name="name"
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
                    disabled={!editAccount}
                    name="name"
                    placeholder={t('toolbar.settings.optionalName', 'Name (optional)')}
                  />
                </FormField>
                <Box>
                  <AddressBox address={wallet.address} border />
                  <Text size="small" margin={{ top: 'small' }}>
                    <DerivationFormatter pathDisplay={wallet.pathDisplay} type={wallet.type} />
                  </Text>
                </Box>
                <Box justify="between" direction="row-responsive" gap="large">
                  <Button
                    label={t('toolbar.settings.exportPrivateKey.title', 'Export Private Key')}
                    disabled={!wallet.privateKey}
                    onClick={() => setLayerVisibility(true)}
                  />

                  {deleteAccount ? (
                    <StyledDeleteButton
                      label={t('toolbar.settings.delete.title', 'Delete Account')}
                      onClick={() => setDeleteLayerVisibility(true)}
                    />
                  ) : (
                    <Tip
                      content={t(
                        'toolbar.settings.delete.tooltip',
                        'You must have at least one account at all times.',
                      )}
                      dropProps={{ align: { bottom: 'top' } }}
                    >
                      <Box>
                        <StyledDeleteButton
                          icon={<CircleInformation size="18px" color="status-error" />}
                          disabled={true}
                          label={t('toolbar.settings.delete.title', 'Delete Account')}
                          onClick={() => setDeleteLayerVisibility(true)}
                        />
                      </Box>
                    </Tip>
                  )}
                </Box>
                <Box justify="between" direction="row-responsive" gap="large">
                  {(wallet.type === WalletType.UsbLedger || wallet.type === WalletType.BleLedger) && (
                    <Button
                      onClick={() => dispatch(walletActions.verifyAddressOnLedger(wallet))}
                      label={t('ledger.verifyAddressOnLedger', 'Verify address on Ledger')}
                    />
                  )}
                </Box>
              </Box>
              <Box direction="row" justify="between" pad={{ top: 'large' }}>
                <Button secondary label={t('toolbar.settings.cancel', 'Cancel')} onClick={closeHandler} />
                <Button primary label={t('toolbar.settings.save', 'Save')} type="submit" />
              </Box>
            </StyledForm>
          </Tab>
        </Tabs>
      </LayerContainer>
      {layerVisibility && (
        <LayerContainer hideLayer={hideLayer}>
          <Tabs>
            <Tab title={t('toolbar.settings.exportPrivateKey.title', 'Export Private Key')}>
              <Box flex="grow" justify="between">
                <Box gap="medium">
                  <Text>
                    {t(
                      'toolbar.settings.exportPrivateKey.hint1',
                      'The private key consists of a string of characters. Anyone with access to your private key has direct access to the assets of that account.',
                    )}
                  </Text>
                  <Text>
                    {t(
                      'toolbar.settings.exportPrivateKey.hint2',
                      'If the private key is lost, it cannot be retrieved. Please make sure to backup the private key and keep it in a safe place.',
                    )}
                  </Text>
                  <RevealOverlayButton
                    label={t(
                      'toolbar.settings.exportPrivateKey.confirm',
                      'I understand, reveal my private key',
                    )}
                  >
                    <PrivateKeyFormatter privateKey={wallet.privateKey!} />
                  </RevealOverlayButton>
                </Box>
                <Box direction="row" justify="between" pad={{ top: 'large' }}>
                  <Button secondary label={t('toolbar.settings.cancel', 'Cancel')} onClick={hideLayer} />
                </Box>
              </Box>
            </Tab>
          </Tabs>
        </LayerContainer>
      )}
      {deleteLayerVisibility && deleteAccount && (
        <DeleteAccount
          onDelete={() => deleteAccount(wallet.address)}
          onCancel={() => setDeleteLayerVisibility(false)}
          wallet={wallet}
        />
      )}
    </>
  )
}
