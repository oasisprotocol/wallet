import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { expectSaga } from 'redux-saga-test-plan'
import * as oasis from '@oasisprotocol/client'
import { importAccountsActions } from '.'
import { accountsPerPage, importAccountsSaga, numberOfAccountPages, sign } from './saga'
import * as matchers from 'redux-saga-test-plan/matchers'
import { Ledger, LedgerSigner } from 'app/lib/ledger'
import { getBalance } from '../wallet/saga'
import { addressToPublicKey, publicKeyToAddress } from 'app/lib/helpers'
import { ImportAccountsListAccount, ImportAccountsStep } from './types'
import { WalletErrors } from 'types/errors'
import { OasisTransaction } from 'app/lib/transaction'
import { WalletType } from 'app/state/wallet/types'

describe('importAccounts Sagas', () => {
  describe('enumerateAccountsFromLedger', () => {
    it('should list accounts for the first page', async () => {
      const validAccount = {
        publicKey: await addressToPublicKey('oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'),
        path: [44, 474, 0, 0, 0],
      }

      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), { close: () => {} }],
          [matchers.call.fn(Ledger.enumerateAccounts), [validAccount]],
          [matchers.call.fn(getBalance), {}],
        ])
        .dispatch(importAccountsActions.enumerateAccountsFromLedger())
        .put.actionType(importAccountsActions.accountGenerated.type)
        .put.actionType(importAccountsActions.accountGenerated.type)
        .put.actionType(importAccountsActions.accountGenerated.type)
        .put.actionType(importAccountsActions.accountGenerated.type)
        .put.actionType(importAccountsActions.accountGenerated.type)
        .put.actionType(importAccountsActions.updateAccountBalance.type)
        .put.actionType(importAccountsActions.updateAccountBalance.type)
        .put.actionType(importAccountsActions.updateAccountBalance.type)
        .put.actionType(importAccountsActions.updateAccountBalance.type)
        .put.actionType(importAccountsActions.updateAccountBalance.type)
        .silentRun(50)
    })

    it('should handle unsupported browsers', async () => {
      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), false],
          [matchers.call.fn(TransportWebUSB.create), { close: () => {} }],
        ])
        .dispatch(importAccountsActions.enumerateAccountsFromLedger())
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
        .dispatch(importAccountsActions.enumerateAccountsFromLedger())
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
        .dispatch(importAccountsActions.enumerateAccountsFromLedger())
        .put.like({ action: { payload: { code: WalletErrors.USBTransportError, message: 'Dummy error' } } })
        .silentRun(50)
    })

    it('should bubble-up other unknown errors', async () => {
      return expectSaga(importAccountsSaga)
        .withState({})
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), { close: () => {} }],
          [matchers.call.fn(Ledger.enumerateAccounts), Promise.reject(new Error('Dummy error'))],
        ])
        .dispatch(importAccountsActions.enumerateAccountsFromLedger())
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
          privateKey: '00',
          publicKey: '00',
          selected: !i,
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
          [matchers.call.fn(getBalance), {}],
        ])
        .dispatch(importAccountsActions.enumerateAccountsFromMnemonic('mnemonic'))
        .put({ type: importAccountsActions.setStep.type, payload: ImportAccountsStep.LoadingAccounts })
        .put({
          type: importAccountsActions.accountsListed.type,
          payload: expectedAccounts,
        })
        .put({ type: importAccountsActions.setStep.type, payload: ImportAccountsStep.Idle })
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
