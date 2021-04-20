import { nic } from 'app/lib/oasis-client'
import { OasisTransaction, signerFromHDSecret, signerFromPrivateKey } from 'app/lib/transaction'
import { push } from 'connected-react-router'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'
import { WalletErrors } from 'types/errors'

import { walletActions as actions, walletActions } from '../slice'
import { rootWalletSaga, sendTransaction, walletSaga } from '../slice/saga'
import { selectAddress, selectWallet } from '../slice/selectors'
import { WalletState, WalletType } from '../slice/types'

describe('Wallet Sagas', () => {
  const validMnemonic =
    'abuse gown claw final toddler wedding sister parade useful typical spatial skate decrease bulk student manual cloth shove fat car little swamp tag ginger'
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
      matchers.select.selector(selectWallet),
      { privateKey: validPrivateKeyHex, balance: { available: '500000000000' }, type: WalletType.PrivateKey },
    ],
    [matchers.select.selector(selectAddress), matchingAddress],
    [matchers.call.fn(nic.stakingAccount), {}],
  ]

  describe('Root Saga', () => {
    it('Should fork once open', () => {
      return expectSaga(rootWalletSaga)
        .withState({})
        .provide(providers)
        .dispatch(walletActions.openWalletFromMnemonic(validMnemonic))
        .fork(walletSaga)
        .silentRun(50)
    })

    it('Should open from mnemonic', () => {
      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState({})
        .dispatch(walletActions.openWalletFromMnemonic(validMnemonic))
        .fork(walletSaga)
        .put(push(`/account/${matchingAddress}`))
        .silentRun(50)
    })

    it('Should open from private key', () => {
      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState({})
        .dispatch(walletActions.openWalletFromPrivateKey(validPrivateKeyHex))
        .fork(walletSaga)
        .select(selectAddress)
        .put(push(`/account/${matchingAddress}`))
        .silentRun(50)
    })

    it('Should close the wallet and wait for another open attempt', () => {
      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState({})
        .dispatch(walletActions.openWalletFromPrivateKey(validPrivateKeyHex))
        .fork(walletSaga)
        .put(push(`/account/${matchingAddress}`))
        .dispatch(walletActions.closeWallet())
        .put(actions.walletClosed())
        .take(actions.openWalletFromMnemonic)
        .silentRun(50)
    })
  })

  describe('Wallet saga', () => {
    it('Should redirect to the account page', () => {
      return expectSaga(walletSaga)
        .withState({})
        .provide(providers)
        .put(push(`/account/${matchingAddress}`))
        .run()
    })

    it('Should push the wallet data to store', () => {
      return expectSaga(walletSaga)
        .withState({})
        .provide(providers)
        .put.actionType(actions.walletLoaded.type)
        .run()
    })
  })

  describe('Send transaction', () => {
    it('Should send transactions from a mnemonic', () => {
      const wallet = {
        balance: { available: '100000000000' },
        privateKey: '00',
        type: WalletType.Mnemonic,
      } as Partial<WalletState>

      return expectSaga(sendTransaction, walletActions.sendTransaction({ amount: 10, to: validAddress }))
        .withState({ wallet })
        .provide(providers)
        .provide(sendProviders)
        .dispatch(actions.sendTransaction({ amount: 123, to: 'testaddress' }))
        .put.actionType(actions.transactionSent.type)
        .run()
    })

    it('Should send transactions from a private key', () => {
      const wallet = {
        balance: { available: '100000000000' },
        privateKey: '00',
        type: WalletType.PrivateKey,
      } as Partial<WalletState>

      return expectSaga(sendTransaction, walletActions.sendTransaction({ amount: 10, to: validAddress }))
        .withState({ wallet })
        .provide(providers)
        .provide(sendProviders)
        .dispatch(actions.sendTransaction({ amount: 123, to: 'testaddress' }))
        .put.actionType(actions.transactionSent.type)
        .run()
    })

    it('Should error without sufficient balance', () => {
      const wallet = {
        balance: { available: '100000000000' },
        privateKey: validPrivateKeyHex,
      } as Partial<WalletState>

      return expectSaga(sendTransaction, walletActions.sendTransaction({ amount: 200, to: validAddress }))
        .withState({ wallet })
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
      } as Partial<WalletState>

      return expectSaga(sendTransaction, walletActions.sendTransaction({ amount: 10, to: validAddress }))
        .withState({ wallet })
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
      } as Partial<WalletState>

      return expectSaga(sendTransaction, walletActions.sendTransaction({ amount: 10, to: 'oasis1notvalid' }))
        .withState({ wallet })
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
      } as Partial<WalletState>

      return expectSaga(sendTransaction, walletActions.sendTransaction({ amount: 10, to: matchingAddress }))
        .withState({ wallet })
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
