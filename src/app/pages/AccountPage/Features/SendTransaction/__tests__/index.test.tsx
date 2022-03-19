import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { SendTransaction } from '..'
import type { UseTranslationResponse } from 'react-i18next'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    } as UseTranslationResponse<'translation'>
  },
}))

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <SendTransaction />
    </Provider>,
  )

describe('<SendTransaction />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should dispatch sendTransaction action on submit', () => {
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store)

    userEvent.type(screen.getByPlaceholderText('account.sendTransaction.enterAddress'), 'walletAddress')
    userEvent.type(screen.getByPlaceholderText('0'), '10')
    userEvent.click(screen.getByRole('button'))

    expect(spy).toHaveBeenCalledWith({
      payload: {
        amount: 10,
        to: 'walletAddress',
        type: 'transfer',
      },
      type: 'transaction/sendTransaction',
    })
  })
})
