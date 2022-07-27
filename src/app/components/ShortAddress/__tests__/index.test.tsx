import { render, screen } from '@testing-library/react'

import { trimLongString, ShortAddress } from '..'

describe('trimLongString', () => {
  it('should return trimmed string', () => {
    expect(trimLongString('qwertyuiopasdfghjkl')).toEqual('qwertyuiop...sdfghjkl')
    expect(trimLongString('qwertyuiopasdfghjkl', 2, -2)).toEqual('qw...kl')
  })

  it('should return short hash', () => {
    expect(trimLongString('6557c86267761b845aa00dac39e892ca58922305c883965f4b0b67a009b0d8d3')).toEqual(
      '6557c86267...09b0d8d3',
    )
  })

  it('should return original string if it is shorter than trimStart value', () => {
    expect(trimLongString('foo')).toEqual('foo')
  })
})

describe('<ShortAddress  />', () => {
  it('should render short address', () => {
    render(<ShortAddress address="qwertyuiopasdfghjkl" />)
    expect(screen.getByText('qwertyuiop...sdfghjkl')).toBeInTheDocument()
  })

  it('should render hash', () => {
    render(<ShortAddress address="6557c86267761b845aa00dac39e892ca58922305c883965f4b0b67a009b0d8d3" />)
    expect(screen.getByText('6557c86267...09b0d8d3')).toBeInTheDocument()
  })

  it('should fallback to unavailable label when short address cannot be created', () => {
    render(<ShortAddress address="" />)
    expect(screen.getByText('common.unavailable')).toBeInTheDocument()
  })
})
