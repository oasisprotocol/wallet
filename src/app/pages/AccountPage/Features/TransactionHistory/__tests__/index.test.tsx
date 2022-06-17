import * as React from 'react'
import { render } from '@testing-library/react'

import { TransactionHistory } from '..'

describe('<TransactionHistory  />', () => {
  it.skip('should match snapshot', () => {
    const component = render(<TransactionHistory />)
    expect(component.container.firstChild).toMatchSnapshot()
  })
})
