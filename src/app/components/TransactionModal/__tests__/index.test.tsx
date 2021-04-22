import * as React from 'react'
import { render } from '@testing-library/react'

import { TransactionModal } from '..'

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

describe('<TransactionModal  />', () => {
  it.skip('should match snapshot', () => {
    const loadingIndicator = render(<TransactionModal />)
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
