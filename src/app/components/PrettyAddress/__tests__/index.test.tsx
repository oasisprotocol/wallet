import * as React from 'react'
import { render } from '@testing-library/react'

import { PrettyAddress } from '..'

describe('<PrettyAddress  />', () => {
  it('should match snapshot', () => {
    const page = render(<PrettyAddress address="oasis1aaaaaaaaaaaa" />)
    expect(page.container.firstChild).toMatchSnapshot()
  })

  it('should split the address', () => {
    const page = render(<PrettyAddress address="oasis1aaaaaaaaaaaa" />)
    expect(page.container.firstChild).toMatchSnapshot()
    expect(page.container.firstChild!.textContent).toMatch(/oasis1 aaaa aaaa aaaa/)
  })
})
