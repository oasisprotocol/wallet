import { render, screen } from '@testing-library/react'

import { ShortAddress } from '..'

describe('<ShortAddress  />', () => {
  it('should render short address', () => {
    render(<ShortAddress address="qwertyuiopasdfghjkl" />)
    expect(screen.getByText('qwertyuiop...sdfghjkl')).toBeInTheDocument()
  })

  it('should fallback to unavailable label when short address cannot be created', () => {
    render(<ShortAddress address="" />)
    expect(screen.getByText('common.unavailable')).toBeInTheDocument()
  })
})
