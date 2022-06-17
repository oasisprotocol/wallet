import * as React from 'react'
import { render } from '@testing-library/react'

import { AccountSelectorButton } from '..'

describe('<AccountSelectorButton  />', () => {
  it.skip('should match snapshot', () => {
    const component = render(<AccountSelectorButton />)
    expect(component.container.firstChild).toMatchSnapshot()
  })
})
