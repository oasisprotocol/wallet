import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { selectTicker } from 'app/state/network/selectors'
import { when } from 'jest-when'
import * as React from 'react'
import { Provider, useSelector } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { BackendAPIs, backend } from 'vendors/backend'
import copy from 'copy-to-clipboard'

import { Transaction } from '..'
import * as transactionTypes from 'app/state/transaction/types'
import { NetworkType } from 'app/state/network/types'
import type { UseTranslationResponse, Trans } from 'react-i18next'

jest.mock('copy-to-clipboard')

type TransType = typeof Trans
jest.mock('react-i18next', () => ({
  Trans: (({ i18nKey }) => <>{i18nKey}</>) as TransType,
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    } as UseTranslationResponse<'translation'>
  },
}))

jest.mock('vendors/backend')
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

const renderComponent = (
  store: any,
  ref: any,
  transaction: transactionTypes.Transaction,
  network: NetworkType,
) =>
  render(
    <Provider store={store}>
      <Transaction referenceAddress={ref} transaction={transaction} network={network} />
    </Provider>,
  )

describe('<Transaction  />', () => {
  let store: ReturnType<typeof configureAppStore>
  const ref = 'sourceAddr'
  const transaction = {
    amount: 1000000,
    timestamp: 1618018255,
    from: 'source',
    to: 'destination',
    type: transactionTypes.TransactionType.StakingTransfer,
    hash: 'ff1234',
    status: true,
  } as transactionTypes.Transaction
  const network = 'mainnet'

  beforeEach(() => {
    jest.mocked(backend).mockImplementation(() => BackendAPIs.OasisScan)
    store = configureAppStore()

    when(useSelector as any)
      .calledWith(selectTicker)
      .mockReturnValue('TEST')
  })

  it('should match snapshot', () => {
    const component = renderComponent(store, ref, transaction, network)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should copy an address and tx hash value to clipboard', () => {
    renderComponent(store, ref, transaction, network)

    userEvent.click(screen.getByLabelText('ContactInfo'))
    expect(copy).toHaveBeenNthCalledWith(1, 'source')

    userEvent.click(screen.getByLabelText('Package'))
    expect(copy).toHaveBeenNthCalledWith(2, 'ff1234')
  })

  it('should mark failed transactions', () => {
    renderComponent(store, ref, { ...transaction, status: false }, network)
    expect(screen.getByText('account.transaction.failed')).toBeInTheDocument()
  })

  it('should handle unknown transaction types gracefully', () => {
    const component = renderComponent(
      store,
      'sourceAddr',
      {
        amount: 1000000,
        timestamp: 1618018255,
        from: 'source',
        to: 'destination',
        type: 'turboencabulate' as transactionTypes.TransactionType,
        hash: 'ff1234',
        fee: undefined,
        level: undefined,
        status: true,
      },
      network,
    )
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should not render a link when address is undefined', () => {
    renderComponent(
      store,
      'sourceAddr',
      {
        amount: 1000000,
        timestamp: 1618018255,
        from: 'sourceAddr',
        to: undefined,
        type: 'anyType' as transactionTypes.TransactionType,
        hash: 'ff1234',
        fee: undefined,
        level: undefined,
        status: true,
      },
      network,
    )

    expect(screen.queryByTestId('external-wallet-address')).not.toBeInTheDocument()
    expect(screen.getByText('common.unavailable')).toBeInTheDocument()
  })

  it('should render testnet link', () => {
    renderComponent(store, ref, transaction, 'testnet')
    expect(screen.getByTestId('explorer-link')).toHaveAttribute(
      'href',
      'https://testnet.oasisscan.com/transactions/ff1234',
    )
  })

  it('should render monitor link', () => {
    jest.mocked(backend).mockImplementation(() => BackendAPIs.OasisMonitor)
    renderComponent(store, ref, transaction, network)
    expect(screen.getByTestId('explorer-link')).toHaveAttribute(
      'href',
      'https://oasismonitor.com/operation/ff1234',
    )
  })

  it('should render testnet monitor link', () => {
    jest.mocked(backend).mockImplementation(() => BackendAPIs.OasisMonitor)
    renderComponent(store, ref, transaction, 'testnet')
    expect(screen.getByTestId('explorer-link')).toHaveAttribute(
      'href',
      'https://testnet.oasismonitor.com/operation/ff1234',
    )
  })
})
