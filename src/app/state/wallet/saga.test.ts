import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'
import { RootState } from 'types'
import { DeepPartialRootState } from 'types/RootState'
import { walletActions } from '.'
import { transactionActions } from '../transaction'
import { getBalance, rootWalletSaga, walletSaga, selectWallet } from './saga'
import { selectActiveWallet } from './selectors'
import { Wallet, WalletState, WalletType } from './types'

describe('Wallet Sagas', () => {
  const validPrivateKeyHex =
    '5f48e5a6fb243f5abc13aac7c56449afbc93be90ae38f10a0465bc82db954f17e75624c8d2cd9f062ce0331373a3be50ef0eccc5d257b4e2dea83a05506c7132'
  const addressHex = 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'
  // const addressMnemonic = 'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l'

  const providers: (EffectProviders | StaticProvider)[] = [[matchers.call.fn(getBalance), {}]]
  const state: DeepPartialRootState = {
    importAccounts: {
      accounts: [
        {
          address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
          balance: { available: '0', validator: { escrow: '0', escrow_debonding: '0' } },
          path: [44, 474, 0],
          privateKey: '00',
          publicKey: '00',
          selected: true,
          type: WalletType.Mnemonic,
        },
      ],
    },
  }

  describe('Root Saga', () => {
    it('Should fork once open', () => {
      return expectSaga(rootWalletSaga)
        .withState(state)
        .provide(providers)
        .dispatch(walletActions.openWalletFromMnemonic())
        .fork(walletSaga)
        .silentRun(50)
    })

    it('Should open from mnemonic', () => {
      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState(state)
        .dispatch(walletActions.openWalletFromMnemonic())
        .fork(walletSaga)
        .put.like({
          action: {
            type: walletActions.addWallet.type,
            payload: {
              address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
              balance: {
                available: '0',
                validator: { escrow: '0', escrow_debonding: '0' },
              },
              id: 1,
              path: [44, 474, 0],
              privateKey: '00',
              publicKey: '00',
              selectImmediately: false,
              type: WalletType.Mnemonic,
            },
          },
        })
        .put.actionType(walletActions.walletOpened.type)
        .put.actionType(walletActions.selectWallet.type)
        .silentRun(200)
    })

    it('Should open from private key', () => {
      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState({})
        .dispatch(walletActions.openWalletFromPrivateKey(validPrivateKeyHex))
        .fork(walletSaga)
        .put.actionType(walletActions.selectWallet.type)
        .silentRun(50)
    })

    it('Should open from ledger', () => {
      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState(state)
        .dispatch(walletActions.openWalletsFromLedger())
        .fork(walletSaga)
        .put.actionType(walletActions.selectWallet.type)
        .silentRun(50)
    })

    it('Should open from ledger and select the first imported wallet as active', () => {
      const state: DeepPartialRootState = {
        importAccounts: {
          accounts: [
            {
              address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
              balance: { available: '0', validator: { escrow: '0', escrow_debonding: '0' } },
              path: [44, 474, 0, 0, 0],
              publicKey: '00',
              selected: true,
            },
            {
              address: 'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
              balance: { available: '0', validator: { escrow: '0', escrow_debonding: '0' } },
              path: [44, 474, 0, 0, 0],
              publicKey: '00',
              selected: true,
            },
          ],
        },
      }

      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState({
          ...state,
          wallet: {
            isOpen: true,
            selectedWallet: 0,
            wallets: [
              {
                address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
                id: 0,
              },
              {
                address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
                id: 1,
              },
            ],
          },
        })
        .dispatch(walletActions.openWalletsFromLedger())
        .fork(walletSaga)
        .put({ type: walletActions.selectWallet.type, payload: 1 })
        .silentRun(50)
    })

    it('Should close the wallet and wait for another open attempt', () => {
      return expectSaga(rootWalletSaga)
        .provide(providers)
        .withState({})
        .dispatch(walletActions.openWalletFromPrivateKey(validPrivateKeyHex))
        .fork(walletSaga)
        .put.actionType(walletActions.selectWallet.type)
        .dispatch(walletActions.closeWallet())
        .put(walletActions.walletClosed())
        .take(walletActions.openWalletFromMnemonic)
        .silentRun(50)
    })
  })

  it('Should redirect user when selecting a wallet', () => {
    return expectSaga(selectWallet, { type: '', payload: 1 })
      .provide([
        ...providers,
        [matchers.select.selector(selectActiveWallet), { address: addressHex } as Partial<Wallet>],
      ])
      .put({ type: walletActions.walletSelected.type, payload: 1 })
      .run()
    // See `useRouteRedirects` tests for redirect after selectedWallet.
  })

  it('Should allow opening multiple wallets', () => {
    return expectSaga(rootWalletSaga)
      .provide(providers)
      .withState(state)
      .dispatch(walletActions.openWalletFromPrivateKey(validPrivateKeyHex))
      .put.actionType(walletActions.walletOpened.type)
      .put.actionType(walletActions.walletSelected.type)
      .dispatch(walletActions.openWalletFromMnemonic())
      .put.actionType(walletActions.walletOpened.type)
      .put.actionType(walletActions.walletSelected.type)
      .silentRun(50)
  })

  it('Should refresh balances on matching transaction', () => {
    return expectSaga(rootWalletSaga)
      .provide(providers)
      .withState({
        account: { address: 'sender' },
        wallet: {
          selectedWallet: 0,
          wallets: [{ address: 'sender', publicKey: '00' } as Partial<Wallet>],
        } as Partial<WalletState>,
      } as Partial<RootState>)
      .dispatch(
        transactionActions.transactionSent({ amount: '1000000000', type: 'transfer', to: 'receiver' }),
      )
      .call.fn(getBalance)
      .put.actionType(walletActions.updateBalance.type)
      .silentRun(50)
  })
})
