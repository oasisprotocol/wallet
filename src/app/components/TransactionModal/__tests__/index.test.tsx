import * as React from 'react'
import { render } from '@testing-library/react'

import { TransactionModal } from '..'

describe('<TransactionModal  />', () => {
  it.skip('should match snapshot', () => {
    const component = render(<TransactionModal />)
    expect(component.container.firstChild).toMatchSnapshot()
  })
})
