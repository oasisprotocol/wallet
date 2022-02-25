import { render, screen } from '@testing-library/react'
import * as React from 'react'

import { Footer } from '..'

describe('<Footer />', () => {
  const originalEnvs = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnvs,
      REACT_APP_BUILD_TIME: '1645464110349',
      REACT_APP_BUILD_VERSION: 'versionNumber',
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
})
