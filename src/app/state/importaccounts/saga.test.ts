import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { expectSaga } from 'redux-saga-test-plan'
import * as oasis from '@oasisprotocol/client'
import { importAccountsActions } from '.'
import { accountsPerPage, importAccountsSaga, numberOfAccountPages, sign } from './saga'
import * as matchers from 'redux-saga-test-plan/matchers'
import { Ledger, LedgerSigner } from 'app/lib/ledger'
import { addressToPublicKey, publicKeyToAddress } from 'app/lib/helpers'
import { ImportAccountsListAccount, ImportAccountsStep } from './types'
import { WalletErrors } from 'types/errors'
import { OasisTransaction } from 'app/lib/transaction'
import { WalletType } from 'app/state/wallet/types'
import delayP from '@redux-saga/delay-p'
import { getAccountBalanceWithFallback } from '../../lib/getAccountBalanceWithFallback'
import { ScanResult } from '@capacitor-community/bluetooth-le'
import BleTransport from '@oasisprotocol/ionic-ledger-hw-transport-ble/lib'

describe('importAccounts Sagas', () => {
  describe('enumerateAccountsFromLedger', () => {
    it('should list accounts for the first page', async () => {
      const validAccount = {
        publicKey: await addressToPublicKey('oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'),
        path: [44, 474, 0, 0, 0],
        pathDisplay: `m/44'/474'/0'/0'/0'`,
      }

      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [
            matchers.call.fn(TransportWebUSB.create),
            {
              close: () => {},
            },
          ],
          [matchers.call.fn(Ledger.getOasisApp), undefined],
          [matchers.call.fn(Ledger.deriveAccountUsingOasisApp), validAccount],
          [matchers.call.fn(getAccountBalanceWithFallback), {}],
        ])
        .dispatch(importAccountsActions.enumerateAccountsFromLedger(WalletType.UsbLedger))
        .put.actionType(importAccountsActions.accountGenerated.type)
        .put.actionType(importAccountsActions.accountGenerated.type)
        .put.actionType(importAccountsActions.accountGenerated.type)
        .put.actionType(importAccountsActions.accountGenerated.type)
        .put.actionType(importAccountsActions.updateAccountBalance.type)
        .put.actionType(importAccountsActions.updateAccountBalance.type)
        .put.actionType(importAccountsActions.updateAccountBalance.type)
        .put.actionType(importAccountsActions.updateAccountBalance.type)
        .silentRun(50)
    })

    it('should list ble devices', async () => {
      const bleDevices: ScanResult[] = []
      for (let i = 0; i < 3; i++) {
        bleDevices.push({
          device: {
            deviceId: `${i}${i}:${i}${i}:${i}${i}:${i}${i}:${i}${i}:${i}${i}`,
            name: `Nano X ABC${i}`,
          },
          localName: `Nano X ABC${i}`,
          rssi: -50,
          txPower: 100,
        })
      }

      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([
          [matchers.call.fn(BleTransport.isSupported), true],
          [matchers.call.fn(BleTransport.list), bleDevices],
        ])
        .dispatch(importAccountsActions.enumerateDevicesFromBleLedger)
        .put.like({ action: { payload: bleDevices } })
        .silentRun(50)
    })

    it('should handle unsupported ble', async () => {
      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([[matchers.call.fn(BleTransport.isSupported), false]])
        .dispatch(importAccountsActions.enumerateAccountsFromLedger(WalletType.BleLedger))
        .put.like({ action: { payload: { code: WalletErrors.BluetoothTransportNotSupported } } })
        .silentRun(50)
    })

    it('should handle unsupported browsers', async () => {
      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), false],
          [
            matchers.call.fn(TransportWebUSB.create),
            {
              close: () => {},
            },
          ],
        ])
        .dispatch(importAccountsActions.enumerateAccountsFromLedger(WalletType.UsbLedger))
        .put.like({ action: { payload: { code: WalletErrors.USBTransportNotSupported } } })
        .silentRun(50)
    })

    it('should handle transport errors', async () => {
      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), Promise.reject(new Error('No device selected'))],
        ])
        .dispatch(importAccountsActions.enumerateAccountsFromLedger(WalletType.UsbLedger))
        .put.like({ action: { payload: { code: WalletErrors.LedgerNoDeviceSelected } } })
        .silentRun(50)
    })

    it('should bubble-up USB unknown errors', async () => {
      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), Promise.reject(new Error('Dummy error'))],
        ])
        .dispatch(importAccountsActions.enumerateAccountsFromLedger(WalletType.UsbLedger))
        .put.like({ action: { payload: { code: WalletErrors.USBTransportError, message: 'Dummy error' } } })
        .silentRun(50)
    })

    it('should bubble-up other unknown errors', async () => {
      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [
            matchers.call.fn(TransportWebUSB.create),
            {
              close: () => {},
            },
          ],
          [matchers.call.fn(Ledger.getOasisApp), undefined],
          [matchers.call.fn(Ledger.deriveAccountUsingOasisApp), Promise.reject(new Error('Dummy error'))],
        ])
        .dispatch(importAccountsActions.enumerateAccountsFromLedger(WalletType.UsbLedger))
        .put.like({ action: { payload: { code: WalletErrors.UnknownError, message: 'Dummy error' } } })
        .silentRun(50)
    })
  })

  describe('enumerateAccountsFromMnemonic', () => {
    const mockAddress = 'dummyAddress'
    const mockKey = new Uint8Array(1)

    it('should list accounts', async () => {
      const expectedAccounts: ImportAccountsListAccount[] = []
      for (let i = 0; i < accountsPerPage * numberOfAccountPages; i++) {
        expectedAccounts.push({
          address: mockAddress,
          path: [44, 474, i],
          pathDisplay: `m/44'/474'/${i}'`,
          privateKey: '00',
          publicKey: '00',
          selected: i === 0,
          type: WalletType.Mnemonic,
        })
      }

      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([
          [
            matchers.call.fn(oasis.hdkey.HDKey.getAccountSigner),
            {
              publicKey: mockKey,
              secretKey: mockKey,
            },
          ],
          [matchers.call.fn(publicKeyToAddress), mockAddress],
          [matchers.call.fn(getAccountBalanceWithFallback), {}],
          [matchers.call.fn(delayP), null], // https://github.com/jfairbank/redux-saga-test-plan/issues/257
        ])
        .dispatch(importAccountsActions.enumerateAccountsFromMnemonic('mnemonic'))
        .put(importAccountsActions.setStep(ImportAccountsStep.LoadingAccounts))
        .put(importAccountsActions.accountsListed(expectedAccounts))
        .put(importAccountsActions.setStep(ImportAccountsStep.Idle))
        .silentRun(50)
    })
  })

  describe('sign', () => {
    it('Should sign and close the transport', () => {
      const mockSigner = { setTransport: jest.fn(), sign: jest.fn().mockResolvedValue(null) }
      const mockTransport = { close: jest.fn() }

      return expectSaga(sign, mockSigner as unknown as LedgerSigner, {} as any)
        .withState({ network: {} })
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), mockTransport],
          [matchers.call.fn(OasisTransaction.signUsingLedger), Promise.resolve()],
        ])
        .call([mockTransport, mockTransport.close])
        .run(50)
    })

    it('Should close the transport even on signature error', () => {
      const mockSigner = { setTransport: jest.fn(), sign: jest.fn().mockResolvedValue(null) }
      const mockTransport = { close: jest.fn() }

      return expectSaga(function* () {
        try {
          yield* sign(mockSigner as unknown as LedgerSigner, {} as any)
        } catch (err) {
          expect(err).toEqual(new Error('Dummy error'))
        }
      })
        .withState({ network: {} })
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), mockTransport],
          [matchers.call.fn(OasisTransaction.signUsingLedger), Promise.reject(new Error('Dummy error'))],
        ])
        .call([mockTransport, mockTransport.close])
        .run(50)
        .catch(e => {
          expect(e).toEqual(new Error('Dummy error'))
        })
    })
  })
})
