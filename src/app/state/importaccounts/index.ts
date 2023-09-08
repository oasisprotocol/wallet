import { PayloadAction } from '@reduxjs/toolkit'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { ImportAccountsListAccount, ImportAccountsState, ImportAccountsStep } from './types'
import { ScanResult } from '@capacitor-community/bluetooth-le'
import { LedgerWalletType } from '../wallet/types'

export const initialState: ImportAccountsState = {
  accounts: [],
  showAccountsSelectionModal: false,
  accountsSelectionPageNumber: 0,
  step: ImportAccountsStep.Idle,
  bleDevices: [],
  showBleLedgerDevicesModal: false,
}

const slice = createSlice({
  name: 'importAccounts',
  initialState,
  reducers: {
    clear(state) {
      state.accounts = []
      state.error = undefined
      state.step = ImportAccountsStep.Idle
      state.showAccountsSelectionModal = false
      state.bleDevices = []
      state.showBleLedgerDevicesModal = false
    },
    enumerateDevicesFromBleLedger(state) {
      state.bleDevices = []
      state.step = ImportAccountsStep.Idle
      state.showBleLedgerDevicesModal = true
      state.bleDevices = []
      state.selectedBleDevice = undefined
    },
    enumerateAccountsFromLedger(state, _action: PayloadAction<LedgerWalletType>) {
      state.accounts = []
      state.accountsSelectionPageNumber = 0
      state.showAccountsSelectionModal = true
      state.step = ImportAccountsStep.Idle
    },
    enumerateMoreAccountsFromLedger(state, _action: PayloadAction<LedgerWalletType>) {
      state.step = ImportAccountsStep.Idle
    },
    enumerateAccountsFromMnemonic(state, _action: PayloadAction<string>) {
      state.step = ImportAccountsStep.Idle
      state.accounts = []
      state.accountsSelectionPageNumber = 0
      state.showAccountsSelectionModal = true
    },
    toggleAccount(state, action: PayloadAction<string>) {
      const account = state.accounts.find(a => a.address === action.payload)!
      account.selected = !account.selected
    },
    accountGenerated(state, action: PayloadAction<ImportAccountsListAccount>) {
      state.accounts.push(action.payload)
    },
    accountsListed(state, action: PayloadAction<ImportAccountsListAccount[]>) {
      state.accounts = action.payload
    },
    updateAccountBalance(
      state,
      action: PayloadAction<Pick<ImportAccountsListAccount, 'address' | 'balance'>>,
    ) {
      const { address, balance } = action.payload
      const account = state.accounts.find(a => a.address === address)
      if (account) account.balance = balance
    },
    setPage(state, action: PayloadAction<number>) {
      state.accountsSelectionPageNumber = action.payload
    },
    setStep(state, action: PayloadAction<ImportAccountsStep>) {
      state.step = action.payload
    },
    operationFailed(state, action: PayloadAction<ErrorPayload>) {
      state.error = action.payload
      state.step = ImportAccountsStep.Idle
    },
    setBleDevices(state, { payload }: PayloadAction<ScanResult[]>) {
      state.bleDevices = payload
    },
    setSelectedBleDevice(state, { payload }: PayloadAction<ScanResult>) {
      state.selectedBleDevice = payload
    },
  },
})

export const { actions: importAccountsActions } = slice

export default slice.reducer
