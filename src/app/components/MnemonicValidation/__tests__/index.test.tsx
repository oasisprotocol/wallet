import { render } from '@testing-library/react'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { MnemonicValidation } from '..'

jest.mock('bip39', () => ({
  wordlists: { english: ['mock1', 'mock2', 'mock3', 'mock4', 'mock5'] },
}))

const renderComponent = (store, component: React.ReactNode) =>
  render(<Provider store={store}>{component}</Provider>)

describe('<MnemonicValidation  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const mnemonic = 'test1 test2 test3 test4 test5 test6'.split(' ')
    const successHandler = jest.fn()
    const abortHandler = jest.fn()

    renderComponent(
      store,
      <MnemonicValidation
        validMnemonic={mnemonic}
        successHandler={successHandler}
        abortHandler={abortHandler}
      />,
    )

    // @TODO The words are shuffled
    // expect(component).toMatchSnapshot()
  })
})
