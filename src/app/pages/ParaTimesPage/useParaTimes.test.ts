import { renderHook, act } from '@testing-library/react-hooks'
import { useSelector } from 'react-redux'
import { when } from 'jest-when'
import { initialState, paraTimesActions } from 'app/state/paratimes'
import { selectAccountAvailableBalance } from 'app/state/account/selectors'
import { selectParaTimes } from 'app/state/paratimes/selectors'
import { TransactionForm, TransactionTypes } from 'app/state/paratimes/types'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { useParaTimes } from './useParaTimes'
import { ParaTime } from 'config'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}))

describe('useParaTimes', () => {
  const accountBalance = '100'
  const paraTimeBalance = '0'

  beforeEach(() => {
    when(useSelector as any)
      .calledWith(selectSelectedNetwork)
      .mockReturnValue('mainnet')
      .calledWith(selectParaTimes)
      .mockReturnValue(initialState)
      .calledWith(selectAccountAvailableBalance)
      .mockReturnValue(accountBalance)
  })

  describe('availableParaTimesForSelectedNetwork', () => {
    it('should return a list of paraTimes for mainnet', () => {
      const { result } = renderHook(() => useParaTimes())

      expect(result.current.availableParaTimesForSelectedNetwork).toEqual([
        {
          isEvm: false,
          value: 'cipher',
        },
        {
          isEvm: true,
          value: 'emerald',
        },
      ])
    })

    it('should return a list of paraTimes for testnet', () => {
      when(useSelector as any)
        .calledWith(selectSelectedNetwork)
        .mockReturnValue('testnet')

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.availableParaTimesForSelectedNetwork).toEqual([
        {
          isEvm: false,
          value: 'cipher',
        },
        {
          isEvm: true,
          value: 'emerald',
        },
        {
          isEvm: true,
          value: 'sapphire',
        },
      ])
    })
  })

  describe('isDepositing', () => {
    it('should return true', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            type: TransactionTypes.Deposit,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.isDepositing).toEqual(true)
    })

    it('should return false for withdraws', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            type: TransactionTypes.Withdraw,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.isDepositing).toEqual(false)
    })
  })

  describe('isEvmcParaTime', () => {
    it('should validate if Cipher is EVMc ParaTime', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Cipher,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.isEvmcParaTime).toEqual(false)
    })

    it('should validate if Emerald is EVMc ParaTime', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Emerald,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.isEvmcParaTime).toEqual(true)
    })

    it('should validate if Sapphire is EVMc ParaTime', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Sapphire,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.isEvmcParaTime).toEqual(true)
    })
  })

  describe('usesOasisAddress', () => {
    it('should use ETH address for EVMc when depositing', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Emerald,
            type: TransactionTypes.Deposit,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.usesOasisAddress).toEqual(false)
    })

    it('should use oasis address for EVMc when withdrawing', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Emerald,
            type: TransactionTypes.Withdraw,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.usesOasisAddress).toEqual(true)
    })

    it('should use oasis address for non EVMc when depositing', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Cipher,
            type: TransactionTypes.Deposit,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.usesOasisAddress).toEqual(true)
    })

    it('should use oasis address for non EVMc when withdrawing', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Cipher,
            type: TransactionTypes.Withdraw,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.usesOasisAddress).toEqual(true)
    })
  })

  describe('balance', () => {
    it('should return account balance when depositing', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            type: TransactionTypes.Deposit,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.balance).toEqual(accountBalance)
      expect(result.current.isWalletEmpty).toEqual(false)
    })

    it('should return paraTime balance when withdrawing', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          balance: paraTimeBalance,
          transactionForm: {
            type: TransactionTypes.Withdraw,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.balance).toEqual(paraTimeBalance)
      expect(result.current.isWalletEmpty).toEqual(true)
    })
  })

  describe('setTransactionForm', () => {
    it('should dispatch an action', () => {
      const { result } = renderHook(() => useParaTimes())

      act(() => {
        result.current.setTransactionForm({ recipient: 'dummyAddress' } as TransactionForm)
      })

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { recipient: 'dummyAddress' },
        type: paraTimesActions.setTransactionForm.type,
      })
    })
  })

  describe('clearTransactionForm', () => {
    it('should dispatch an action', () => {
      const { result } = renderHook(() => useParaTimes())

      act(() => {
        result.current.clearTransactionForm()
      })

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: paraTimesActions.clearTransactionForm.type,
      })
    })
  })

  describe('paraTimeName', () => {
    it('should return a translation key for a paraTime', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Cipher,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.paraTimeName).toEqual('paraTimes.common.cipher')
    })
  })

  describe('balanceInBaseUnit', () => {
    it('should return true when depositing', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Cipher,
            type: TransactionTypes.Deposit,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.balanceInBaseUnit).toEqual(true)
    })

    it('should return true when withdrawing from non EVMc paraTime', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Cipher,
            type: TransactionTypes.Withdraw,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.balanceInBaseUnit).toEqual(true)
    })

    it('should return false for EVMc paraTime', () => {
      when(useSelector as any)
        .calledWith(selectParaTimes)
        .mockReturnValue({
          transactionForm: {
            paraTime: ParaTime.Emerald,
            type: TransactionTypes.Withdraw,
          },
        })

      const { result } = renderHook(() => useParaTimes())

      expect(result.current.balanceInBaseUnit).toEqual(false)
    })
  })
})
