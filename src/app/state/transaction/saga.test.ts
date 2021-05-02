import { OasisTransaction, signerFromHDSecret, signerFromPrivateKey } from 'app/lib/transaction'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'
import { RootState } from 'types'
import { WalletErrors } from 'types/errors'

import { transactionActions as actions } from '.'
import { selectAddress, selectActiveWallet } from '../wallet/selectors'
import { Wallet, WalletType } from '../wallet/types'
import { sendTransaction } from './saga'

const makeState = (wallet: Partial<Wallet>) => {
  return {
    wallet: {
      wallets: { 0: { id: 0, ...wallet } },
      selectedWallet: 0,
      isOpen: true,
    },
  } as Partial<RootState>
}

describe('Transaction Sagas', () => {
  const validPrivateKeyHex =
    '5f48e5a6fb243f5abc13aac7c56449afbc93be90ae38f10a0465bc82db954f17e75624c8d2cd9f062ce0331373a3be50ef0eccc5d257b4e2dea83a05506c7132'
  const matchingAddress = 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'
  const validAddress = 'oasis1qqty93azxp4qeft3krvv23ljyj57g3tzk56tqhqe'

  const sendProviders: (EffectProviders | StaticProvider)[] = [
    [matchers.call.fn(signerFromPrivateKey), {}],
    [matchers.call.fn(signerFromHDSecret), {}],
    [matchers.call.fn(OasisTransaction.buildTransfer), {}],
    [matchers.call.fn(OasisTransaction.sign), {}],
    [matchers.call.fn(OasisTransaction.submit), {}],
  ]

  const providers: (EffectProviders | StaticProvider)[] = [
    [
      matchers.select.selector(selectActiveWallet),
      { privateKey: validPrivateKeyHex, balance: { available: '500000000000' }, type: WalletType.PrivateKey },
    ],
    [matchers.select.selector(selectAddress), matchingAddress],
  ]

  describe('Send transaction', () => {
    it('Should send transactions from a mnemonic', () => {
      const wallet = {
        balance: { available: '100000000000' },
        privateKey: '00',
        type: WalletType.Mnemonic,
      } as Partial<Wallet>

      return expectSaga(sendTransaction, actions.sendTransaction({ amount: 10, to: validAddress }))
        .withState(makeState(wallet))
        .provide(providers)
        .provide(sendProviders)
        .dispatch(actions.sendTransaction({ amount: 123, to: 'testaddress' }))
        .dispatch(actions.confirmTransaction())
        .put.actionType(actions.transactionSent.type)
        .run()
    })

    it('Should send transactions from a private key', () => {
      const wallet = {
        balance: { available: '100000000000' },
        privateKey: '00',
        type: WalletType.PrivateKey,
      } as Partial<Wallet>

      return expectSaga(sendTransaction, actions.sendTransaction({ amount: 10, to: validAddress }))
        .withState(makeState(wallet))
        .provide(providers)
        .provide(sendProviders)
        .dispatch(actions.sendTransaction({ amount: 123, to: 'testaddress' }))
        .dispatch(actions.confirmTransaction())
        .put.actionType(actions.transactionSent.type)
        .run()
    })

    it('Should allow aborting transactions', () => {
      const wallet = {
        balance: { available: '100000000000' },
        privateKey: '00',
        type: WalletType.PrivateKey,
      } as Partial<Wallet>

      return expectSaga(sendTransaction, actions.sendTransaction({ amount: 10, to: validAddress }))
        .withState(makeState(wallet))
        .provide(providers)
        .provide(sendProviders)
        .dispatch(actions.sendTransaction({ amount: 123, to: 'testaddress' }))
        .dispatch(actions.abortTransaction())
        .not.put.actionType(actions.transactionSent.type)
        .put.actionType(actions.clearTransaction.type)
        .run()
    })

    it('Should error without sufficient balance', () => {
      const wallet = {
        balance: { available: '100000000000' },
        privateKey: validPrivateKeyHex,
      } as Partial<Wallet>

      return expectSaga(sendTransaction, actions.sendTransaction({ amount: 200, to: validAddress }))
        .withState(makeState(wallet))
        .put(
          actions.transactionFailed({
            code: WalletErrors.InsufficientBalance,
            message: 'Insufficient balance',
          }),
        )
        .run()
    })

    it('Should error with invalid private key', () => {
      const wallet = {
        balance: { available: '100000000000' },
        privateKey: '00',
      } as Partial<Wallet>

      return expectSaga(sendTransaction, actions.sendTransaction({ amount: 10, to: validAddress }))
        .withState(makeState(wallet))
        .put(
          actions.transactionFailed({
            code: WalletErrors.InvalidPrivateKey,
            message: 'Invalid private key',
          }),
        )
        .run()
    })

    it('Should error when sending to an invalid address', () => {
      const wallet = {
        balance: { available: '100000000000' },
        privateKey: validPrivateKeyHex,
        address: matchingAddress,
        type: WalletType.PrivateKey,
      } as Partial<Wallet>

      return expectSaga(sendTransaction, actions.sendTransaction({ amount: 10, to: 'oasis1notvalid' }))
        .withState(makeState(wallet))
        .put(
          actions.transactionFailed({
            code: WalletErrors.InvalidAddress,
            message: 'Invalid address',
          }),
        )
        .run()
    })

    it('Should error when trying to send to self', () => {
      const wallet = {
        balance: { available: '100000000000' },
        privateKey: validPrivateKeyHex,
        address: matchingAddress,
      } as Partial<Wallet>

      return expectSaga(sendTransaction, actions.sendTransaction({ amount: 10, to: matchingAddress }))
        .withState(makeState(wallet))
        .put(
          actions.transactionFailed({
            code: WalletErrors.CannotSendToSelf,
            message: 'Cannot send to your own account',
          }),
        )
        .run()
    })
  })
})
