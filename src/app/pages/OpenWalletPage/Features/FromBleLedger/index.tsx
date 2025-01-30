import { importAccountsActions } from 'app/state/importaccounts'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Heading } from 'grommet/es6/components/Heading'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectShowAccountsSelectionModal,
  selectShowBleLedgerDevicesModal,
} from 'app/state/importaccounts/selectors'
import { Header } from 'app/components/Header'
import { ListBleLedgerDevicesModal } from '../ListBleLedgerDevicesModal'
import { ImportAccountsSelectionModal } from '../ImportAccountsSelectionModal'
import { WalletType } from '../../../../state/wallet/types'

export function FromBleLedger() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const showAccountsSelectionModal = useSelector(selectShowAccountsSelectionModal)
  const showBleLedgerDevicesModal = useSelector(selectShowBleLedgerDevicesModal)

  return (
    <Box
      background="background-front"
      margin="small"
      pad="medium"
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
    >
      <Header>{t('openWallet.ledger.header', 'Open from Ledger device')}</Header>

      <Heading level="2" margin="0">
        {t('ledger.instructionSteps.header', 'Steps:')}
      </Heading>
      <ol>
        <li>
          {t(
            'ledger.instructionSteps.connectBluetoothLedger',
            'Connect your Ledger to this device via Bluetooth',
          )}
        </li>
        <li>
          {t('ledger.instructionSteps.deviceIsPaired', 'Make sure your Ledger is paired with this device')}
        </li>
        <li>{t('ledger.instructionSteps.closeLedgerLive', 'Close the Ledger Live app on your computer')}</li>
        <li>{t('ledger.instructionSteps.openOasisApp', 'Open the Oasis app on your Ledger')}</li>
      </ol>
      <Box direction="row" margin={{ top: 'medium' }}>
        <Button
          type="submit"
          label={t('openWallet.importAccounts.selectDevice', 'Select device')}
          onClick={() => {
            dispatch(importAccountsActions.enumerateDevicesFromBleLedger())
          }}
          primary
        />
      </Box>
      {showBleLedgerDevicesModal && (
        <ListBleLedgerDevicesModal
          abort={() => {
            dispatch(importAccountsActions.clear())
          }}
          next={() => {
            dispatch(importAccountsActions.enumerateAccountsFromLedger(WalletType.BleLedger))
          }}
        />
      )}
      {showAccountsSelectionModal && (
        <ImportAccountsSelectionModal
          abort={() => {
            dispatch(importAccountsActions.clear())
          }}
          type={WalletType.BleLedger}
        />
      )}
    </Box>
  )
}
