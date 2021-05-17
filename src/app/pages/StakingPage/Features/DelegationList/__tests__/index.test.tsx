import * as React from 'react'
import { render } from '@testing-library/react'

import { DelegationList } from '..'

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

describe('<DelegationList  />', () => {
  it.skip('should match snapshot', () => {
    const loadingIndicator = render(<DelegationList />)
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
