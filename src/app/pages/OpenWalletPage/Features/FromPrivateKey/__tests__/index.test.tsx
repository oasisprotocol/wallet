import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'

import { FromPrivateKey } from '..'

const renderPage = store =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <FromPrivateKey />
      </ThemeProvider>
    </Provider>,
  )

describe('<FromPrivateKey  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const page = renderPage(store)
    expect(page.container.firstChild).toMatchSnapshot()
  })

  it('should display an error on invalid private key', () => {
    renderPage(store)
    const textbox = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    userEvent.type(textbox, 'hello')
    userEvent.click(button)
    const errorElem = screen.getByText(/Invalid private key/)
    expect(errorElem).toBeInTheDocument()

    // A valid phrase should remove the error
    textbox.setSelectionRange(0, 5)
    userEvent.type(
      textbox,
      'X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg==',
    )
    userEvent.click(button)
    expect(errorElem).not.toBeInTheDocument()
  })
})
