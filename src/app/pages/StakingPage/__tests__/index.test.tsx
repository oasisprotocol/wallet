import * as React from 'react'
import { render } from '@testing-library/react'

import { StakingPage } from '..'

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

describe('<StakingPage  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<StakingPage />)
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
