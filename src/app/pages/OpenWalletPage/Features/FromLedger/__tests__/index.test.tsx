import * as React from 'react'
import { render } from '@testing-library/react'

import { FromLedger } from '..'

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

describe('<FromLedger  />', () => {
  it.skip('should match snapshot', () => {
    const loadingIndicator = render(<FromLedger />)
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
