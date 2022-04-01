import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { Navigation } from '..'

const renderComponent = (store: any) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    </Provider>,
  )
}

describe('<Navigation />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
    jest.resetAllMocks()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it.todo('should be responsive')
})
