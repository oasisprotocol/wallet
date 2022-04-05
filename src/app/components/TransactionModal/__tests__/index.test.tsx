import * as React from 'react'
import { render } from '@testing-library/react'

import { TransactionModal } from '..'

describe('<TransactionModal  />', () => {
  it.skip('should match snapshot', () => {
    const loadingIndicator = render(<TransactionModal />)
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
