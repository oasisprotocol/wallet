import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { expectSaga } from 'redux-saga-test-plan'
import { ledgerActions } from '.'
import { ledgerSaga, sign } from './saga'
import * as matchers from 'redux-saga-test-plan/matchers'
import { Ledger, LedgerSigner } from 'app/lib/ledger'
import { getBalance } from '../wallet/saga'
import { addressToPublicKey } from 'app/lib/helpers'
import { LedgerStep } from './types'
import { WalletErrors } from 'types/errors'
import { OasisTransaction } from 'app/lib/transaction'

describe('Ledger Sagas', () => {
  describe('enumerateAccounts', () => {
    it('should list accounts', async () => {
      const validAccount = {
        publicKey: await addressToPublicKey('oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'),
        path: [44, 474, 0, 0, 0],
      }

      return expectSaga(ledgerSaga)
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), { close: () => {} }],
          [matchers.call.fn(Ledger.enumerateAccounts), [validAccount]],
          [matchers.call.fn(getBalance), {}],
        ])
        .dispatch(ledgerActions.enumerateAccounts())
        .put(ledgerActions.setStep(LedgerStep.Done))
        .put.actionType(ledgerActions.accountsListed.type)
        .run(50)
    })

    it('should handle unsupported browsers', async () => {
      return expectSaga(ledgerSaga)
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), false],
          [matchers.call.fn(TransportWebUSB.create), { close: () => {} }],
        ])
        .dispatch(ledgerActions.enumerateAccounts())
        .put.like({ action: { payload: { code: WalletErrors.USBTransportNotSupported } } })
        .run(50)
    })

    it('should handle transport errors', async () => {
      return expectSaga(ledgerSaga)
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), Promise.reject(new Error('No device selected'))],
        ])
        .dispatch(ledgerActions.enumerateAccounts())
        .put.like({ action: { payload: { code: WalletErrors.LedgerNoDeviceSelected } } })
        .run(50)
    })

    it('should bubble-up USB unknown errors', async () => {
      return expectSaga(ledgerSaga)
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), Promise.reject(new Error('Dummy error'))],
        ])
        .dispatch(ledgerActions.enumerateAccounts())
        .put.like({ action: { payload: { code: WalletErrors.USBTransportError, message: 'Dummy error' } } })
        .run(50)
    })

    it('should bubble-up other unknown errors', async () => {
      return expectSaga(ledgerSaga)
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), { close: () => {} }],
          [matchers.call.fn(Ledger.enumerateAccounts), Promise.reject(new Error('Dummy error'))],
        ])
        .dispatch(ledgerActions.enumerateAccounts())
        .put.like({ action: { payload: { code: WalletErrors.UnknownError, message: 'Dummy error' } } })
        .run(50)
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

      return expectSaga(sign, mockSigner as unknown as LedgerSigner, {} as any)
        .withState({ network: {} })
        .provide([
          [matchers.call.fn(TransportWebUSB.isSupported), true],
          [matchers.call.fn(TransportWebUSB.create), mockTransport],
          [matchers.call.fn(OasisTransaction.signUsingLedger), Promise.reject()],
        ])
        .call([mockTransport, mockTransport.close])
        .run(50)
    })
  })
})
