import * as React from 'react'
import { render } from '@testing-library/react'

import { PrettyAddress } from '..'

describe('<PrettyAddress  />', () => {
  it('should match snapshot', () => {
    const page = render(<PrettyAddress address="oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4" />)
    expect(page.container.firstChild).toMatchSnapshot()
  })

  it('should split the address', () => {
    const page = render(<PrettyAddress address="oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4" />)
    expect(page.container.firstChild).toMatchSnapshot()
    expect(page.container.firstChild!.textContent).toMatch(
      /oasis1 qq2v zcvx n0js 5uns ch5m e2xz 4kr4 3vca sv0d 5eq4/,
    )
  })
})
