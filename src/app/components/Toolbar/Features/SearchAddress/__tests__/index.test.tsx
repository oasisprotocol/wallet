import * as React from 'react'
import { render } from '@testing-library/react'

import { SearchAddress } from '..'

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
    const loadingIndicator = render(<SearchAddress />)
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
