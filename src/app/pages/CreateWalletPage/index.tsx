/**
 *
 * CreateWalletPage
 *
 */
import { AlertBox } from 'app/components/AlertBox'
import { MnemonicGrid } from 'app/components/MnemonicGrid'
import { MnemonicValidation } from 'app/components/MnemonicValidation'
import { NoTranslate } from 'app/components/NoTranslate'
import { ResponsiveLayer } from 'app/components/ResponsiveLayer'
import { importAccountsActions } from 'app/state/importaccounts'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { Grid } from 'grommet/es6/components/Grid'
import { Layer } from 'grommet/es6/components/Layer'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Text } from 'grommet/es6/components/Text'
import { Refresh } from 'grommet-icons/es6/icons/Refresh'
import * as React from 'react'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Header } from 'app/components/Header'
import { ImportAccountsSelectionModal } from 'app/pages/OpenWalletPage/Features/ImportAccountsSelectionModal'
import { selectShowAccountsSelectionModal } from 'app/state/importaccounts/selectors'
import { createWalletActions } from './slice'
import { selectCheckbox, selectMnemonic } from './slice/selectors'
import { WalletType } from 'app/state/wallet/types'

export interface CreateWalletProps {}

export function CreateWalletPage(props: CreateWalletProps) {
  const { t } = useTranslation()
  const showAccountsSelectionModal = useSelector(selectShowAccountsSelectionModal)
  const [showConfirmation, setConfirmation] = useState(false)
  const [showMnemonicMismatch, setMnemonicMismatch] = useState(false)
  const size = React.useContext(ResponsiveContext)

  const dispatch = useDispatch()

  const mnemonic = useSelector(selectMnemonic)
  const checked = useSelector(selectCheckbox)

  const setChecked = (value: boolean) => dispatch(createWalletActions.setChecked(value))
  const regenerateMnemonic = () => dispatch(createWalletActions.generateMnemonic())
  const openWallet = (enteredMnemonic: string) => {
    const doesMnemonicMatch = enteredMnemonic === mnemonic.join(' ')
    setMnemonicMismatch(!doesMnemonicMatch)
    setConfirmation(false)

    if (doesMnemonicMatch) {
      dispatch(importAccountsActions.enumerateAccountsFromMnemonic(enteredMnemonic))
    }
  }

  React.useEffect(() => {
    // Clean-up when leaving this page
    return () => {
      dispatch(createWalletActions.clear())
    }
  }, [dispatch])

  //@TODO Remove when firefox supports backdropFilter (used inside MnemonicValidation)
  // https://github.com/oasisprotocol/oasis-wallet-web/issues/287
  const blurMnemonicInFirefox = showConfirmation ? { filter: 'blur(5px)' } : {}

  return (
    <>
      {showMnemonicMismatch && (
        <AlertBox
          status="error"
          content={t('createWallet.mnemonicMismatch', 'Entered mnemonic does not match.')}
        />
      )}
      {showConfirmation && (
        <Layer
          plain
          full
          style={{ backdropFilter: 'blur(5px)' }}
          // Needed to prevent keyboard accessibility issues with layer inside
          // layer: https://github.com/oasisprotocol/oasis-wallet-web/issues/863
          modal={false}
        >
          <ResponsiveLayer
            style={{
              width: { small: '100vw', medium: '90vw', large: '1500px' }[size],
            }}
            background="background-front"
            onEsc={() => setConfirmation(false)}
            onClickOutside={() => setConfirmation(false)}
            modal
          >
            <MnemonicValidation
              successHandler={openWallet}
              abortHandler={() => setConfirmation(false)}
            ></MnemonicValidation>
          </ResponsiveLayer>
        </Layer>
      )}
      {showAccountsSelectionModal && (
        <ImportAccountsSelectionModal
          abort={() => {
            dispatch(importAccountsActions.clear())
          }}
          type={WalletType.Mnemonic}
        />
      )}
      <Grid gap="small" pad="small" columns={size === 'small' ? ['auto'] : ['2fr', '2fr']}>
        <Box background="background-front" style={blurMnemonicInFirefox}>
          <MnemonicGrid mnemonic={mnemonic.length > 0 ? mnemonic : new Array(24).fill('')} />
          <Box margin="xsmall" pad="small" background="background-contrast" style={{ wordSpacing: '14px' }}>
            <NoTranslate>
              <strong data-testid="generated-mnemonic">{mnemonic.join(' ')}</strong>
              {/* Chrome workaround: Prevent copying extra newlines after user triple clicks mnemonic to copy */}
              <span style={{ userSelect: 'none' }}></span>
            </NoTranslate>
            <Box direction="row" justify="start" margin={{ top: 'medium' }}>
              <Button
                icon={<Refresh />}
                label={t('createWallet.newMnemonic', 'Generate a new mnemonic')}
                primary
                onClick={regenerateMnemonic}
              />
            </Box>
          </Box>
        </Box>
        <Box pad="medium" background="background-front" round="5px">
          <Header>{t('createWallet.thisIsYourPhrase', 'This is your mnemonic')}</Header>
          <Box width="100%" justify="evenly" margin={{ vertical: 'small' }}>
            <Text margin="0">
              <Trans
                i18nKey="createWallet.instruction"
                t={t}
                defaults="Save your keyphrase <strong>in the right order</strong> in a secure location, you will need it to open your wallet."
              ></Trans>
            </Text>
          </Box>
          <AlertBox
            status="warning"
            content={t(
              'createWallet.doNotShare',
              'Never share your keyphrase, anyone with your keyphrase can access your wallet and your tokens.',
            )}
          />
          <Box pad={{ vertical: 'medium' }}>
            <CheckBox
              label={t('createWallet.confirmSaved', 'I saved my keyphrase')}
              disabled={mnemonic.length <= 0}
              checked={checked}
              onChange={event => setChecked(event.target.checked)}
            />
            <Box direction="row" justify="between" margin={{ top: 'medium' }}>
              <Button
                type="submit"
                label={t('openWallet.mnemonic.import', 'Import my wallet')}
                primary
                disabled={!checked}
                onClick={() => {
                  setConfirmation(true)
                }}
              />
            </Box>
          </Box>
        </Box>
      </Grid>
    </>
  )
}
