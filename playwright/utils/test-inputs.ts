import type { ImportAccountsStep } from '../../src/app/state/importaccounts/types'
import type { TransactionFormSteps } from '../../src/app/state/paratimes/types'
import type { WalletType } from '../../src/app/state/wallet/types'
import type { RootState } from '../../src/types/RootState'

export const mnemonicAddress0 = 'oasis1qqca0gplrfn63ljg9c833te7em36lkz0cv8djffh'
export const mnemonicAddress0Pretty = 'oasis1 qqca 0gpl rfn6 3ljg 9c83 3te7 em36 lkz0 cv8d jffh'
export const mnemonic = 'planet believe session regular rib kiss police deposit prison hundred apart tongue'

export const privateKeyAddress = 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'
export const privateKeyAddressPretty = 'oasis1 qz0k 5q8v jqvu 4s4n wxyj 406y lnfl kc4v rcjg huwk'
export const privateKey =
  'X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg=='

export const privateKey2Address = 'oasis1qzu5y29xzw5vm0f9glcpg9ckx7lulpg69qjp4hc6'
export const privateKey2AddressPretty = 'oasis1 qzu5 y29x zw5v m0f9 glcp g9ck x7lu lpg6 9qjp 4hc6'
export const privateKey2 = `
  -----BEGIN ED25519 PRIVATE KEY-----
  ZqtrV0QtEY/JemfTPbOl9hgk3UxHXfZO42G4sG+XKHThZTM+GvRiqsAgc7magKNN
  4MEkyO0pi7lJeunILQKiZA==
  -----END ED25519 PRIVATE KEY-----`

export const password = 'Abcd1234&'
export const wrongPassword = 'wrongPassword1&'

function typedStringify<T>(obj: T): string & { stringifiedType: T } {
  return JSON.stringify(obj) as any
}

export const privateKeyPersistedState = typedStringify({
  secretbox: {
    $Uint8Array$:
      'lKwFkSoMsqI/hMJe5hhDh0lnRAUxdhgWw9TpnBg1LcpUkilXDYPZFLigkGxdTKgJG57OI1cBtsISb6mEtrDcIgAovjRDa+N3DaGooZnjdDJcJJXIJWaPRKc42afPlqz+Akb5m18lKsmS06g69om63xY4Hyi6ebBNik5RZ5unfMKVsL2+jDop22mmFKLfuPjMeIiuPo50SXWOiU/qsRKwp0fhpRf6hbQ2zSNLtVIzfDtCLyKbal1ElEQym116gtC67SeP1wlRZSWuoRPWuljC4h4WWndHgwxgIFoc+GrcqdLJ2iBv10CG1EsYmC+jqj4Eeq6b2zZUIQRq6Pl7WRKo+SoazyVKqoLPsXSJ1xfayrs0VvqFOeVpP1p26hrMb0RwAt9bxc6WxF6Os8AjVme7ONTaimYxtAcwC1D0/KJ406duhNoymO+E9OGmBwKn+I4BYglTH0Gvn/qQDwjFcOQRdEXYTljDpfI2UBZqFARmM8kH0Yvho1M7KEY+uAvZt4ijOkY/qT/XCUTFpIsZsERT3P6GWDagGsl5GEDZm9MJS+6VLrK8OIje90Z+2vgTxAY4bawLU/b5lQsMRQldC4gukK0UIisXLyRgqKeVEy3Wr2sx+fYFSOaQycReMS1wqJpsYSMzZNMVCO9G8ef1ZzYXF9570fpwRzJhC0xI7NLcMOgUCTq4VoNenIBAW50l7RLXVhnMKodFYBgcjjoMy7j7kUk2SxiF83CIEn8156wSL2mH4loaSHRHaNx6mRxmEldrSFcuCqhHeEw12b5KeW9lJA9TpYNHJk5Y0vDAsi7Y7AZosBVn7x4sKBhslSbUdM8NLEf9rAcmBdwEYnTiJoSfPqd6AcE8cgcoiAgEKxyYOFS+cVQj9RofMXdnrG2W7Mp93KRVxLcZN805AnqwCJu15GosFhXhRTVLu8aaCOJ9T+N6gXVUVJpR4l4vVhFLuXHn4p5I7lzN1HYrS9WyWFzWqGGPCGism34eCxOohsQ8dnazE/xWibOYamu44f7I+o1yW5F/MmCBOzro7fher1kfv0V4RBQZyNUlQzOSA3zPc+JTYhSW0KQyaPIJTYKjVXEvnPUuPjirwlQ63RjFTQAWCuIjAeHQT2YjjqP7X5yWKMNIB78tbmCwpmnvZx2ysSrpNS/YXlaz1QRFBVOz0hiMKE1k9ihyOnlo+lmh6vQmzP85WgFqFKyzye6iWElTy2M=',
  },
  nonce: { $Uint8Array$: 'uTf/3wnfC1PnWEoJrmULoMg0qffau4MM' },
  salt: { $Uint8Array$: 'dQSGvwmyAqxs/vECZ2eIAkphq0pNKG+w69jNz/lIpKI=' },
})

export const privateKeyUnlockedState = {
  account: {
    address: '',
    available: null,
    debonding: null,
    delegations: null,
    total: null,
    accountError: undefined,
    transactions: [],
    transactionsError: undefined,
    loading: true,
  },
  contacts: {},
  evmAccounts: {},
  createWallet: { checkbox: false, mnemonic: [] },
  fiatOnramp: { thirdPartyAcknowledged: false },
  fatalError: {},
  importAccounts: {
    accounts: [],
    showAccountsSelectionModal: false,
    accountsSelectionPageNumber: 0,
    step: 'idle' satisfies `${ImportAccountsStep}` as ImportAccountsStep,
  },
  network: {
    ticker: 'ROSE',
    chainContext: 'b11b369e0da5bb230b220127f5e7b242d385ef8c6f54906243f30af63c815535',
    selectedNetwork: 'mainnet',
    epoch: 18372,
    minimumStakingAmount: 100,
  },
  paraTimes: {
    balance: '',
    isLoading: false,
    transactionForm: {
      amount: '',
      confirmTransfer: false,
      confirmTransferToValidator: false,
      confirmTransferToForeignAccount: false,
      defaultFeeAmount: '',
      ethPrivateKey: '',
      feeAmount: '',
      feeGas: '',
      paraTime: undefined,
      recipient: '',
      type: undefined,
    },
    transactionFormStep: 'transferType' satisfies `${TransactionFormSteps}` as TransactionFormSteps,
  },
  staking: {
    debondingDelegations: null,
    delegations: null,
    updateDelegationsError: undefined,
    validators: null,
    updateValidatorsError: undefined,
    selectedValidatorDetails: null,
    selectedValidator: null,
    loading: false,
  },
  theme: { selected: 'dark' },
  transaction: { success: false, active: false },
  wallet: {
    wallets: {
      oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk: {
        address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
        balance: {
          address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
          allowances: [],
          available: '0',
          debonding: '0',
          delegations: '0',
          total: '0',
          validator: {
            escrow: '0',
            escrow_debonding: '0',
          },
        },
        privateKey:
          '5f48e5a6fb243f5abc13aac7c56449afbc93be90ae38f10a0465bc82db954f17e75624c8d2cd9f062ce0331373a3be50ef0eccc5d257b4e2dea83a05506c7132',
        publicKey: 'e75624c8d2cd9f062ce0331373a3be50ef0eccc5d257b4e2dea83a05506c7132',
        type: 'private_key' satisfies `${WalletType}` as WalletType,
      },
    },
    isOpen: true,
    selectedWallet: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
  },
  persist: {
    hasPersistedProfiles: true,
    isPersistenceUnsupported: false,
    loading: false,
    stringifiedEncryptionKey: typedStringify({
      // Varies
      key: { $Uint8Array$: 'tZVWIC8qNX4pBAFHUBeDTHppyH1Z4uwqRilH27kx+Us=' },
      salt: { $Uint8Array$: 'dQSGvwmyAqxs/vECZ2eIAkphq0pNKG+w69jNz/lIpKI=' },
    }),
    enteredWrongPassword: false,
  },
  // TODO: this doesn't check types?!
} satisfies RootState
