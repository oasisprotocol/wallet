import type { ImportAccountsStep } from 'app/state/importaccounts/types'
import type { TransactionFormSteps } from 'app/state/paratimes/types'
import type { WalletType } from 'app/state/wallet/types'
import type { RootState } from 'types'
import type { EncryptedData, StringifiedType, WalletExtensionV0State } from '../walletExtensionV0'

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

function typedStringify<T>(obj: T): StringifiedType<T> {
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
    bleDevices: [],
    showBleLedgerDevicesModal: false,
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
} satisfies RootState

export const walletExtensionV0PersistedState = {
  chromeStorageLocal: {
    keyringData: JSON.stringify({
      data: '6wVltZe5h8jKU/Lp1Xdq8CnTuzmg3+Pj3n3Mcac/wcbkGWdUVTpA8I8YNY9wyoGrS2wy2h/ITSSoLK/FdATeIZzJAFSpGeEkkdhSvmpjp6Azh2z9xVEhW+jbnRPqR9d45reBkVVbas8Mohp8J2zyj7lNrd3yXhcwbAdmUdtCKVZa3RXmVHx9t8m33xb1kjju9KteQLMEjnncpRNCJq48i+z3AletozbjAiZjRjq9MJhmy1NViR5LcAyQOjGQzuEIPpWikPHxGrDHySWN5mSQjwoSKsHx1M8L9u1ZyYJXADE43QTQtHphSsNzAV3i88GB1LbRez6QqI1ThQXV/NQYwNnWS6INgS5AsmbUBSz2f6uYQoYbzeM15QcbwIUQayMK44Q6C9p+ZzZuf1FKcVAn2LHdhfgUF4dUbOkqe5Irwr05pK6zDznZC9+Zh53SOCsygJV2Yt8CnTStb80PhaxjJRdyB1zwae2KjUliK9G4Pna2R4XI2c4MtB4gcR1tbTC9NWQ5l3IQgLqXwD1nq1pvh1qgCccH5oUYUJoRaeYoew/h2Xmo1rFCJ0R6RHW0cmxLbnWreLf/bBbQfou4EKkF//67IdngkddngYwnraW/Bnn44iNPEa8lDhkGYhiAs2KEB5EfEG/awZQ6DkmwFeeh0H0MuYQUl2MGOSn+EQShjeW1diipB5xDReYUSBfSC09ZB83oTcETZsc3y5Pn/Sj0Krg3mill69yaV3WgaIHF1tgJoarXqo1IIwDI5lAqWhrGXNJukZz7zDY4f9mwFrRYXDxBeDuUMlvWkEYc2rlv9aUoqeqbzchrKP0FuXndN1T9hr+uM4tL80GpGTelh5iGceCEQgACSWWWEmmnX8Gr6iAsOx7FeZktvy4LGM+E9uQTPb6gEMOFRS+hEWnbzFblaWA43sDA6EF1rmwsWaPHyGLnutC527y8BlULn5PE04jPbIbfqyzATjuuu9eCBJkduvGR6btI2DiXXZwzfq+bmqQHparyX5XRs9dxWKNTRgkV5oqIaZ86Pk/TvM/bwIvV9G4F3TFEp3OhZvfCx1Ta8LeNULksZNbi9QX9uM83LRffV+D9u7fT3yMVJGEA3xzxq3kQAKQschBvgQdmayJG9pl0ZvEDx0PsAiwfUC9x+LwZu/cTg9X4dAuk8MThL4MtJzyly1dsQWxSoZjG+f+EHdyn9zrCUXWkt6eRUJfDp7Pgfqv2LNIjQZDIVPiRFih507CjTGvV8dpF6yjDYDnwQCilvvwZVqJrrn8Ykyyfd2cbUpg3YDqDlXZ+BU4UJ8pvAbcMLGT2Izyr5XJPB8lYafQJRXg/U3HFxSj8QYLeK/qWPGUp9RJlMcCzTEGPoGK/Md0yfA8OKly7MSbhjK1RsJomQD9ig9TjHTkaXId+wTYF87ZT1yRTxKM/yCRh6KkClHGje9WzvOnqn7nu4QvM8SdIvtEkyyHnPfj5HxPlMgKysyrOfWQifB3Gv4LZX/yxebK3jb3pJYHqtlS8uajMXkS0Q/5GNuLu7flDVqoqqBMJrDobGQrzu0XuhcMBR+xl+a+M3MrlCEBfdoS5wuz9CSlxtDD9zy2905MtWXkoAsqrOucWtN58D4PK+vffwD+pn1ut6Y5tJgaPhxLW2fpzcezSUDN0IbuyUnUp2PIMu+nU6id7onloX9R/Lm/ZT4UMJgP7nT/9rYG5jNjNc4H29tBj4CeeTYauTkXEdk00cunvphD8PawZTV5TjNhUCxq+NtAzvJvrbG74Yn5ErVVok15ZLOfMrTPaIRoqxHqOfJGTMLbN+fpg5N2GnlyZfo1/dAG0QlTTJKo9xMTx1QhjqNYCKX57OEjTJ3Rc2r3TWkVPXwgyBTPjSh4C9PSEhI2GhAnLp8UYzcvO4l9g2luK9FnE4RTP5qyoXQjYZUfYXlE7p96et9yVSPiY7gwKR+W91BA5wxQqQcK8ceHmMzwfVt8BE82rulBTM3sWm6YwkALm/Rk9Dw5zUFAl7KnEF4zmioq5bYeCBqEQyMDUwbmdFQADR90pHke3Ql8OZJSwvoeMhYO1vm3mHMm8bw0VcytScsjdzX7kRABmMxPdQGYPt+rL82i5OOXi10x0Zbc1QZo8Cv8A9onTu/OY9j8Uc/4n6/oB8mM0WHL3PTWuGNfxHBc3WfqjSy39lIicviO2TmRDhOg9Tl5TQIiBGUhd+/VBiUnMuJP3gdsimj3z8PB7nQIX9kzCmWanKbEZx9rojS7coQRO4eo/CVz4dGuUZG1EfFmdh6XsIQIp6sxOcaxCiYlhSA/rMBa10oUN0Pe4kWuHQUU0jeARIQwWmhKuU3WKBnSnneKdF61RD9AqD6KOYVprUtP1m0swGfFu/u6aSu0oU3E213WuYc94/er0YtKyg6nzawXqVY9DmjvbvlbgdnaBOmDspdt52J0DfYdEoLuRVCy3IyupfjSbGGllQRD3emkgsTgMZc4wX47p3MY4Zx1dD6ifAYuB5sCAYzGSzfrRaW16BYodDDe4gCiXbvqcZGKouAd11LmpxpRzzu7GNUc3O6/AKBl8tpze2g2BdjsKP+Up0kgmGWo7qrLONyMka996c+3d2lfkjNOrrEbSDkVghxWwCeMiq5LO1jS6rXLDt8VOzdMSCq6k+K4mGMF8wMvIAUEr5nOFkl5XV0s7SehbwbvZ1f6H2ti1w2b6PdIqx+XhDYySXbl+C26GOz3XYt4G/DZyXus7jaAL1ca1MYkeV+4BJDKsS0+unv9TczC9PHUBhFdUg1ttaO7725B4dIg780UO/cwEXZ/ECKBNOe2LQpp0nxrNwZDEnVrzCdPpJs1IrUK876XTAKUhn5vGoKOBPDMxxCYuBH1LSp3doQr1PdgsY83YL5HEgwECNPOvzHuRYTaw/E3TlK/mTNaUk0Xu3NGm957NX6LWb9qP5Im6M1R0ypazhSqDiH+KUIeXiHG1Lkxo6UafepNIt7ushDathY9Ef8mxLfzZMHiPN5FRSTWaL+uPOiYNT5wTpSZvz3KN1IpxZb5OpuEkm9QEHeZUXNkojP/GadgFPv3/CqCdRyzpsetYRDXwblDxz/QdZUJ90e4+A65TTzkGgUoDdbotxpmdkWFm7H6Xse9mUlWhsWTs7qRg60nxlKqQNBicUKwsiw63+13Zhp1wT6m4qfsZb8dSTt6ocO/kKeLFpv/s9xA+wJvKkw1xBvF5QkAC1TWOH4gJRNZey9MhkAcTJ7Yb4uDdEfLYYVkjuqD73TK2bKp+a0HuNS4DI6yMsXpGxJ1fz3btg8Ct8OWy+1qF7OX0kakfmulTEIWra1C3ev7rOOzJ2qOZ8WNdXIta7COROP+Z51mM3Mj3Rwb8od/t/h+JIybQfM+zVohAfQY9drLJchacQQbRsV9/YFeEpV7bXkgyYBEdnm/meUI/loltEQNkmk7IzTNBC5xtRFcIk1IbZNlwxNa60+tL1dd8Zj86FgFRHYvO/qYewgz8uZPp3QYHssHK6ON/+C9UQk9O1qi7i/fpd269gjiJHaEdK6G2DrAiP0AlPS0A0HqFU8kBMcW+DKzGlk0fbRfv4eIGmlnsRtJiSnHkI2pe9d301iZpevmK7b6t/uKoxVTHIAmMAcPOZKma0ZEioVte1jPmQ6AAn5HT+UcF0n2nLOLmjwbtR6VdbigbtqPm67rRO21jyOlqWabQWUDI1mvOvBBdM4mgk6xfukqd4g3wUQ/scXGYWBBdoTYj2TJkkA67XUmuMRhLDZwtXlEUZ2PMic8Oxo5nnZE1aKZ8W+h4O3yaOBwal19GVCloS+pVxMLdTQHpxe3emcxeAbUZO+sTCsbwvLWkxU46XceAIkDB+wYRrMdsgC8n/xaea2TlnRM6awwJRDDYyh/m1+XCIOY2ypbNIgtK9JrH98G39iUDw+ic9ApSIMkbN471kthVjc5jgsJKzsO4RAGl8CvKsqgmmKA1VSbEvGj31h6/Bi32sIjN5MGm3zwCQNt/n+G8dFSHpWBn4b723bS14GyLz/03k4H7JmI7NG6D/PJrFoDdY2afqhnO/dg5H4xdPJTrJ+x2a2JkSFVK2mM8pSXUcUAvUBi90uoEYm5dd1eqj9dlnmt3qMGUcyP8fj+57riPAE3WdaPYYjQEqe47ZFhC5A/kUyodPOwy08n6pzmgSG0B4v1mixT5CDjl1y/YsnlTIOLh3jAv4n3SsuggT2P6PP8Q1Kq0aJeBJQXUiAlenP6GfyTnTK3Ac3R5MMRyrfKpvE/Z2uBe8Bmrr6uZPHjakS1pwjb0bL44v1RyouNatSLRxqoWhvrzpYr55xXaO9gn6cXQhH80kPL480hnSqgMU6F8qCjO/9/9WSWwSoBkZzjPgTDal9e3UQZvF3hlU2tnqDvO811anspQENHZF6SU1zVLchXdtZONmnVUxaFqIvczH2sceZ4Lre5O4YT7iSjpnpk8XUlSL4IrKyE6oJ6AoaOma+KqUQqQK2bhvSzW1DJIRN1kNvk6MxWkrwQno2eP61YH7egBSzoZiqkEJoeGXtDABlgCJVNZg2mJJ1LY8tGWQl63IwSIG9aYZ4cr9A0lmBlYBSFXVeRlq8ofPrTvZiGMxzfO6BfhFAfjHVKZh764D//y/QZtE/biqTnRC84gAxipmrYOut+ClXlRJOBon7ta8o+UTxa6ZGGknG+DB0l5KNce3vNcBS3c4+G9roOu3E6yHNTXHf1B/DH5mHDVJLO/XsrcvDJtPHcw5LjB+1SHCxnIU2zh/HT08uu+cRXZ2Un06GSBCprns2ag3ZDdYLbPi5ag1qbihMBKXJuxkYClEv95F7xvDalowrzafRPE7m1fNSWkh+qnnVY7DMOX9cfo7HFJbw4picLlvETh4DyI+4tSjkZFo454UU3O3JsfNG+Mzfrbj6T+TMTOdAulWovOlpwb7Qi9lJyOLp8EJtiSa5oVWVB5rKKzXTEDgqW+67EkUKr7+KlNi/Q0x8p/E3vNbKQ8BQycYWKwcRY16D/rzy8CUdEc7fIwYYlAslSMoj5mAb0JoZZ73+G5aEtZB/zjF/1ZKCCGDhRTV4o63/Lyqo+BO9VHjczR2VS+XNDUJDGkBobBzr77FV8bI2Qq2ep1cgywWB56PNkmd5hM6gAXtTHMakj9syLmcubSVxE9JPqewfY1cKxFqs5CUAqi8amhVTKMTWWx28aZymBCBTUFVWWoKLVZCC93vvEVKYX3H/98QI23jpbNhOKMakR+aOBWMyJCIeaUsT/TKevrPPkB1OfBgbuc++/NfpDl+4IgI5I+4baNKEkxQbjtblY3SFgse91ZaAfRCz75ua1j+ukWHDPHB1bc78osVh3oI99PMq0stP9oMvFLqs7iloyPrcRWIxLH75Tx9zmQOwVwZvd4v/95nqZ/7da3ByI7ZZXb4O6PETraNXJ96wO3SCxvr9x34yqxMV/Su2r9BjtYgfO2E8jzUwJbA/8dKnUOAGuzGs30MXAqDKeSZiaDN3D60vq4xyDzcml6apGgsO+VSkan37KnHRkBI0mH9Kcpzqrb+gusgVlsy0CZIOvGa/eobx6ukJr8W5li59xL6cl79XEZ7wWYe5LsvmwDkpxVCVDk9KHKoNSePS7mvUNAzTW2ULC64I8kfcBSl0o595jd9/9aShAwzaKiUhQpHt6Tb3j6Iz53fFrd8Xd1mxsfZRAlHBFzP0xaL/P/1voJRH6rTDkAbgdjBHQ1MxAp/NTVSWzmxy6srGA7nwdFO/OZc+focGVY5WyA4JTYss6qL0B3xZ93Qaixk6UZiQWMjy7jNRimURQL8r/PaflK29moCiXM8N9JLZPq3s8DgE450pu3VQJ6R1fNkE2fmgMXzUPSidDL29Wh5Z8BPDv4O8d2dngI7pJEBWxFzQCGqcU6kkWI7MhvsG+OXrWAzfuYjI9YGPew1B91lgMl9qLfVUJU/8ghic4Ekzt8qQ1nNMzZafSPLzEO/A44nr7s8hq+nZmSrRtUUcbv7K9iZnKeG0eexvoa1DObrwTGV3jd3inHuA8a/cZAFen6rCH3ZT9LS0tw/Gs+5crD8HBW1U1CAyx4kZUWq+rq2Xc6YaDXlIUe3kLMkGsc+qn13hkl31O1ljDbr0PIINRhQqEPARVvxfqdDy8DvgqMuRjTChICMa5Wqaxg5Hzhem1w9VGMQJhmnFXKJlnoPJbbrZ8ktt2GM0nuOQOOF1SE/opW+SkJt9jzISmwSd8jZzuwoExivckCCt9I9rN9dvDXuUdT7gDFW26UOw9F7U6Zf7vqU5MZonEAh7vWwTyMTiS1hpcrMa6s3zj1C1wPWfgTru5etuuatf/06wuc7elpS8Hf13s5hZoi8kNZCGkHyQaheHcL2vAuN/bjSu+76doU5vZgyziQIMWIkNA/6vRv5yipnCKLSzm0YIGjAXIvRpCmSU7U4EJ1fOtrMcu0HEehOHE4Znu2QfIPWUFP7KYTbjiodKE7+I4tUD85EglExkwHksQ9bPmO57YBoLnqOHdOBVTf8Ev/xum7wMrIJalTvVHC2+R9lp/W9+MPW9WWTc1RJi0y0PuyIa4zgmRcxxCG/uuDasKulC2dhKQQ2h7OvGcYDozducvhV7Vz57dX+gsb1V6wLP013v8sOO6pA7HQVNUAXCSlWjrRL7/qdeDF7g==',
      iv: 'xcB9YTpj5KCDyLxoYt9eqQ==',
      salt: 'A4K7eVgk+QHpGdGRegzeQ2S6bjEjuTa+zupxVdVG8RE=',
    }) as EncryptedData,
  },
  localStorage: {
    ADDRESS_BOOK_CONFIG: typedStringify([
      {
        name: 'Binance',
        address: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
      },
      {
        name: 'stakefish',
        address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
      },
    ]),
    LANGUAGE_CONFIG: 'en',
    NETWORK_CONFIG: typedStringify({
      totalNetList: [
        {
          id: 0,
          name: 'Mainnet',
          url: 'https://api.oasisscan.com/mainnet',
          explorer: 'https://www.oasisscan.com/',
          netType: 'Mainnet',
          nodeType: 'DEFAULT',
          grpc: 'https://grpc.oasis.dev',
          isSelect: true,
        },
        {
          id: 1,
          name: 'Testnet',
          url: 'https://api.oasisscan.com/testnet',
          explorer: 'https://testnet.oasisscan.com/',
          netType: 'Testnet',
          nodeType: 'DEFAULT',
          grpc: 'https://testnet.grpc.oasis.dev',
          isSelect: true,
        },
      ],
      currentNetList: [
        {
          id: 1,
          name: 'Testnet',
          url: 'https://api.oasisscan.com/testnet',
          explorer: 'https://testnet.oasisscan.com/',
          netType: 'Testnet',
          nodeType: 'DEFAULT',
          grpc: 'https://testnet.grpc.oasis.dev',
          isSelect: false,
        },
        {
          id: 0,
          name: 'Mainnet',
          url: 'https://api.oasisscan.com/mainnet',
          explorer: 'https://www.oasisscan.com/',
          netType: 'Mainnet',
          nodeType: 'DEFAULT',
          grpc: 'https://grpc.oasis.dev',
          isSelect: true,
        },
      ],
    }),
    DISMISSED_NEW_EXTENSION_WARNING: undefined,
  },
} satisfies WalletExtensionV0State
