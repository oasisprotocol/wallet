import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { configureAppStore } from 'store/configureStore'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { FromMnemonic } from '..'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

const renderPage = store =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <FromMnemonic />
      </ThemeProvider>
    </Provider>,
  )

describe('<FromMnemonic/>', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  // @todo this has a random mnemonic...
  it('should match snapshot', () => {
    const page = renderPage(store)
    expect(page.container.firstChild).toMatchSnapshot()
  })

  it('should display an error on invalid mnemonic', () => {
    renderPage(store)
    const textbox = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    userEvent.type(textbox, 'hello')
    userEvent.click(button)
    const errorElem = screen.getByText('openWallet.mnemonic.error')
    expect(errorElem).toBeInTheDocument()

    // A valid phrase should remove the error
    textbox.setSelectionRange(0, 5)
    userEvent.type(textbox, 'echo toward hold roast rather reduce cute civil equal whale wait conduct')
    userEvent.click(button)
    expect(errorElem).not.toBeInTheDocument()
  })

  it('newlines in mnemonic should be valid', () => {
    renderPage(store)
    const textbox = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    userEvent.type(textbox, 'echo\ntoward hold   roast\n rather reduce cute civil equal whale wait conduct')
    userEvent.click(button)
    const errorElem = screen.queryByText('openWallet.mnemonic.error')
    expect(errorElem).toBeNull()
  })
})
