import { render, screen } from '@testing-library/react'

import { Footer } from '..'

jest.unmock('react-i18next')

describe('<Footer />', () => {
  const originalEnvs = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnvs,
      REACT_APP_BUILD_DATETIME: '1645464110349',
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

    expect(screen.getByText(/Powered by Oasis Scan API.*/)).toBeInTheDocument()
  })
})
