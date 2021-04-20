import { render } from '@testing-library/react'
import * as React from 'react'

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

const renderPage = () => render(<Toolbar />)

describe('<Toolbar  />', () => {
  it('should match snapshot', () => {
    const page = renderPage()

    expect(page.container.firstChild).toMatchSnapshot()
  })
})
