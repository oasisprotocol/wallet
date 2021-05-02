import { render } from '@testing-library/react'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { Toolbar } from '..'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

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

const renderComponent = store =>
  render(
    <Provider store={store}>
      <Toolbar />
    </Provider>,
  )

describe('<Toolbar  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const page = renderComponent(store)

    expect(page.container.firstChild).toMatchSnapshot()
  })
})
