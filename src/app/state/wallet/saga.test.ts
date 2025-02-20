import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'
import { DeepPartialRootState } from 'types/RootState'

import { walletActions } from '.'
import { transactionActions } from '../transaction'
import { addWallet, rootWalletSaga } from './saga'
import { AddWalletPayload, WalletType } from './types'
import { importAccountsActions } from '../importaccounts'
import { getAccountBalanceWithFallback } from '../../lib/getAccountBalanceWithFallback'
import delayP from '@redux-saga/delay-p'

describe('Wallet Sagas', () => {
  const validPrivateKeyHex =
    '5f48e5a6fb243f5abc13aac7c56449afbc93be90ae38f10a0465bc82db954f17e75624c8d2cd9f062ce0331373a3be50ef0eccc5d257b4e2dea83a05506c7132'
  const addressHex = 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'
  // const addressMnemonic = 'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l'

  const providers: (EffectProviders | StaticProvider)[] = [
    [matchers.call.fn(getAccountBalanceWithFallback), {}],
    [matchers.call.fn(delayP), null], // https://github.com/jfairbank/redux-saga-test-plan/issues/257
  ]
  const state: DeepPartialRootState = {
    importAccounts: {
      accounts: [
        {
          address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
          balance: { available: '0', debonding: '0', delegations: '0', total: '0' },
          path: [44, 474, 0],
          pathDisplay: `m/44'/474'/0'`,
          privateKey: '00',
          publicKey: '00',
          selected: true,
          type: WalletType.Mnemonic,
        },
      ],
      accountsSelectionPageNumber: 0,
    },
  }

  describe('Root Saga', () => {
    it('Should fork once open', () => {
      return expectSaga(rootWalletSaga)
        .withState(state)
        .provide(providers)
        .dispatch(walletActions.openWalletFromMnemonic({ choosePassword: undefined }))
        .silentRun(50)
    })

    it('Should open from mnemonic', () => {
      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState(state)
        .dispatch(walletActions.openWalletFromMnemonic({ choosePassword: undefined }))
        .put(importAccountsActions.clear())
        .call(addWallet, {
          address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
          balance: { available: '0', debonding: '0', delegations: '0', total: '0' },
          path: [44, 474, 0],
          pathDisplay: `m/44'/474'/0'`,
          privateKey: '00',
          publicKey: '00',
          selectImmediately: true,
          type: WalletType.Mnemonic,
        } as AddWalletPayload)
        .put.actionType(walletActions.walletOpened.type)
        .put(walletActions.selectWallet('oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4'))
        .silentRun(200)
    })

    it('Should open from private key', () => {
      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState({})
        .dispatch(
          walletActions.openWalletFromPrivateKey({
            privateKey: validPrivateKeyHex,
            choosePassword: undefined,
          }),
        )
        .call.like({
          fn: addWallet,
          args: [
            {
              address: addressHex,
              type: WalletType.PrivateKey,
            } as AddWalletPayload,
          ],
        })
        .put.actionType(walletActions.selectWallet.type)
        .silentRun(50)
    })

    it('Should open from ledger', () => {
      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState(state)
        .dispatch(walletActions.openWalletsFromLedger({ choosePassword: undefined }))
        .put(importAccountsActions.clear())
        .put.actionType(walletActions.selectWallet.type)
        .silentRun(50)
    })

    it('Should open from ledger and select the first imported wallet as active', () => {
      const state: DeepPartialRootState = {
        importAccounts: {
          accounts: [
            {
              address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
              balance: { available: '0', debonding: '0', delegations: '0', total: '0' },
              path: [44, 474, 0, 0, 0],
              pathDisplay: `m/44'/474'/0'/0'/0'`,
              publicKey: '00',
              selected: true,
            },
            {
              address: 'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
              balance: { available: '0', debonding: '0', delegations: '0', total: '0' },
              path: [44, 474, 0, 0, 0],
              pathDisplay: `m/44'/474'/0'/0'/0'`,
              publicKey: '00',
              selected: true,
            },
          ],
          accountsSelectionPageNumber: 0,
        },
      }

      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState<DeepPartialRootState>({
          ...state,
          wallet: {
            selectedWallet: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
            wallets: {
              oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk: {
                address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
              },
              oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4: {
                address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
              },
            },
          },
        })
        .dispatch(walletActions.openWalletsFromLedger({ choosePassword: undefined }))
        .put({
          type: walletActions.selectWallet.type,
          payload: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
        })
        .silentRun(50)
    })
  })

  it.skip('Should redirect user when selecting a wallet', () => {
    // See `useRouteRedirects` tests for redirect after selectWallet.
  })

  it('Should allow opening multiple wallets', () => {
    return expectSaga(rootWalletSaga)
      .provide(providers)
      .withState(state)
      .dispatch(
        walletActions.openWalletFromPrivateKey({ privateKey: validPrivateKeyHex, choosePassword: undefined }),
      )
      .put.actionType(walletActions.walletOpened.type)
      .put.actionType(walletActions.selectWallet.type)
      .dispatch(walletActions.openWalletFromMnemonic({ choosePassword: undefined }))
      .put.actionType(walletActions.walletOpened.type)
      .put.actionType(walletActions.selectWallet.type)
      .silentRun(50)
  })

  it('Should refresh balances on matching transaction', () => {
    return expectSaga(rootWalletSaga)
      .provide(providers)
      .withState<DeepPartialRootState>({
        account: { address: 'sender' },
        wallet: {
          selectedWallet: 'sender',
          wallets: {
            sender: { address: 'sender', publicKey: '00' },
          },
        },
      })
      .dispatch(
        transactionActions.transactionSent({ amount: '1000000000', type: 'transfer', to: 'receiver' }),
      )
      .call.fn(getAccountBalanceWithFallback)
      .put.actionType(walletActions.updateBalance.type)
      .silentRun(50)
  })

  it('Should refresh balances on paraTime transaction', () => {
    return expectSaga(rootWalletSaga)
      .provide(providers)
      .withState<DeepPartialRootState>({
        account: { address: addressHex },
        wallet: {
          selectedWallet: 'dummy',
          wallets: { dummy: { address: addressHex, publicKey: '00' } },
        },
      })
      .dispatch(transactionActions.paraTimeTransactionSent('dummyAddress'))
      .call.fn(getAccountBalanceWithFallback)
      .put.actionType(walletActions.updateBalance.type)
      .silentRun(50)
  })
})
