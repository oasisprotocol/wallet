/**
 *
 * CreateWalletPage
 *
 */
import { MnemonicGrid } from 'app/components/MnemonicGrid'
import { Box, Button, CheckBox, Grid, Heading, ResponsiveContext, Text } from 'grommet'
import { Refresh } from 'grommet-icons/icons'
import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { useWalletSlice } from '../WalletPage/slice'
import { useCreateWalletSlice } from './slice'
import { selectCheckbox, selectMnemonic } from './slice/selectors'

export interface CreateWalletProps {
  checked?: boolean
  mnemonic?: string
}

export function CreateWalletPage(props: CreateWalletProps) {
  const { t } = useTranslation()
  const size = React.useContext(ResponsiveContext)
  const createWalletActions = useCreateWalletSlice().actions
  const walletActions = useWalletSlice().actions

  const dispatch = useDispatch()

  const mnemonic = useSelector(selectMnemonic)
  const checked = useSelector(selectCheckbox)

  const setChecked = (value: boolean) => dispatch(createWalletActions.setChecked(value))
  const regenerateMnemonic = () => dispatch(createWalletActions.generateMnemonic())
  const openWallet = () => {
    dispatch(walletActions.openWalletFromMnemonic(mnemonic))
  }

  // Generate a mnemonic on first mount
  React.useEffect(() => {
    dispatch(createWalletActions.generateMnemonic())

    // Clean-up when leaving this page
    return () => {
      dispatch(createWalletActions.clear())
    }
  }, [createWalletActions, dispatch])

  return (
    <Grid gap="small" pad="small" columns={size === 'small' ? ['auto'] : ['2fr', '2fr']}>
      <Box background="light-5">
        <MnemonicGrid mnemonic={mnemonic} />
        <Box margin="xsmall" pad="small" background="light-1" style={{ wordSpacing: '14px' }}>
          <strong>{mnemonic}</strong>
          <Box direction="row" justify="end" margin={{ top: 'medium' }}>
            <Button
              icon={<Refresh />}
              label={t('createWallet.newMnemonic', 'Generate a new mnemonic')}
              style={{ borderRadius: '4px' }}
              primary
              onClick={regenerateMnemonic}
            />
          </Box>
        </Box>
      </Box>
      <Box margin={{ left: 'small', vertical: 'small', right: 'small' }}>
        <Heading margin="0">{t('createWallet.thisIsYourPhrase', 'This is your mnemonic')}</Heading>
        <Box width="100%" justify="evenly" margin={{ vertical: 'small' }}>
          <Text margin="0">
            <Trans i18nKey="createWallet.instruction" t={t}>
              Save your keyphrase <strong>in the right order</strong> in a secure location, you will need it
              to open your wallet.
            </Trans>
          </Text>
        </Box>
        <Text weight="bold" color="status-warning">
          {t(
            'createWallet.doNotShare',
            'Never share your keyphrase, anyone with your keyphrase can access your wallet and your tokens.',
          )}
        </Text>
        <Box pad={{ vertical: 'medium' }}>
          <CheckBox
            label={t('createWallet.confirmSaved', 'I saved my keyphrase')}
            checked={checked}
            onChange={event => setChecked(event.target.checked)}
          />
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button
              type="submit"
              label={t('openWallet.mnemonic.open', 'Open my wallet')}
              style={{ borderRadius: '4px' }}
              primary
              disabled={!checked}
              onClick={openWallet}
            />
          </Box>
        </Box>
      </Box>
    </Grid>
  )
}
