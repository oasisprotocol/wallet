import { render, screen } from '@testing-library/react'
import * as React from 'react'

import { Footer } from '..'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
  }),
  Trans: ({ components }: { components: React.ReactNode }) => components,
}))

describe('<Footer />', () => {
  const originalEnvs = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnvs,
      REACT_APP_BUILD_TIME: '1645464110349',
      REACT_APP_BUILD_VERSION: 'versionNumber',
      REACT_APP_BACKEND: 'oasisscan',
    }
  })

  afterAll(() => {
    process.env = originalEnvs
  })

  it('should render a link with version number', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: 'version' })).toHaveAttribute(
      'href',
      'https://github.com/oasisprotocol/oasis-wallet-web/commit/versionNumber',
    )
  })

  it('should render backend label', () => {
    render(<Footer />)

    expect(screen.getByText('footer.poweredBy.oasisscan')).toBeInTheDocument()
  })
})
