import * as React from 'react'
import { render } from '@testing-library/react'

import { AccountSelectorButton, addressToNumber } from '..'

describe('<AccountSelectorButton  />', () => {
  it.skip('should match snapshot', () => {
    const component = render(<AccountSelectorButton />)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('addressToNumber for JazzIcon should return the same value as extension wallet', () => {
    expect(addressToNumber('oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe')).toBe(-323287268)
    expect(addressToNumber('oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')).toBe(-77419490)
  })
})
