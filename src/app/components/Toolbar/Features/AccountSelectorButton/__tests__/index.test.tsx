import * as React from 'react'
import { render } from '@testing-library/react'

import { AccountSelectorButton } from '..'

describe('<AccountSelectorButton  />', () => {
  it.skip('should match snapshot', () => {
    const loadingIndicator = render(<AccountSelectorButton />)
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
