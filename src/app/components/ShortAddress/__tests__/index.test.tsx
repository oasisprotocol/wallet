import { render, screen } from '@testing-library/react'

import { trimLongString, ShortAddress } from '..'

describe('trimLongString', () => {
  it('should return trimmed string', () => {
    expect(trimLongString('oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4')).toEqual('oasis1qq2v...sv0d5eq4')
    expect(trimLongString('oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4', 2, 2)).toEqual('oa...q4')
  })

  it('should return short hash', () => {
    expect(trimLongString('6557c86267761b845aa00dac39e892ca58922305c883965f4b0b67a009b0d8d3')).toEqual(
      '6557c86267...09b0d8d3',
    )
  })

  it('should return original string if it is shorter than trimStart value', () => {
    expect(trimLongString('foo')).toEqual('foo')
  })

  it('it should not return a "trimmed" version that is actually longer than the original, even if longer than trimStart', () => {
    expect(trimLongString('unavailable')).toEqual('unavailable')
  })
})

describe('<ShortAddress  />', () => {
  it('should render short address', () => {
    render(<ShortAddress address="oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4" />)
    expect(screen.getByText('oasis1qq2v...sv0d5eq4')).toBeInTheDocument()
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
