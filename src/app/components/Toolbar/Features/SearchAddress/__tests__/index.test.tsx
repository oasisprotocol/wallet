import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { SearchAddress } from '..'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'


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

describe('<SearchAddress  />', () => {
  it('should match snapshot', () => {
    const component = render(<SearchAddress />)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should display an error on invalid address', async () => {
    const component = render(<SearchAddress />)
    const searchBar = await component.findByTestId('searchaddress')
    userEvent.type(searchBar, 'hello{enter}')
    const errorElem = screen.getByText('errors.invalidAddress')
    expect(errorElem).toBeInTheDocument()
  })

  it('should redirect to the account', async () => {
    const history = createMemoryHistory()
    const pushSpy = jest.spyOn(history, 'push')

    const component = render(
      <Router history={history}>
        <SearchAddress />
      </Router>,
    )

    const searchBar = await component.findByTestId('searchaddress')
    userEvent.type(searchBar, 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk{enter}')
    expect(pushSpy).toHaveBeenCalledWith('/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')
  })
})
