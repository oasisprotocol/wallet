import { render, screen } from '@testing-library/react'
import { BuildBanner } from '..'

function mockLocation(href: string) {
  // @ts-expect-error Location isn't optional so typescript complains
  delete window.location
  // @ts-expect-error Type approximately matches
  window.location = new URL(href)
}

describe('<BuildBanner />', () => {
  const originalLocation = window.location

  beforeEach(() => {
    mockLocation('http://localhost/')
  })
  afterEach(() => {
    window.location = originalLocation
  })

  it('should render warning banner when not on official deploy', () => {
    mockLocation('https://lw-new-domain.oasis-wallet.pages.dev/')
    render(<BuildBanner />)

    expect(screen.getByText('banner.buildPreview')).toBeInTheDocument()
  })

  it('should not render warning banner on official deploy', () => {
    mockLocation('https://wallet.oasis.io/')
    render(<BuildBanner />)

    expect(screen.queryByText('banner.buildPreview')).not.toBeInTheDocument()
  })
})
