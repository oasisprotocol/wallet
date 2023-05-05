import { render, screen } from '@testing-library/react'
import { BuildBanner } from '..'

describe('<BuildBanner />', () => {
  const env = process.env

  afterEach(() => {
    process.env = { ...env }
  })

  it('should render banner when env variable is provided', () => {
    process.env.REACT_APP_BUILD_PREVIEW = 'preview'
    render(<BuildBanner />)

    expect(screen.getByText('banner.buildPreview')).toBeInTheDocument()
  })

  it('should not render banner', () => {
    process.env.REACT_APP_BUILD_PREVIEW = undefined
    render(<BuildBanner />)

    expect(screen.queryByText('banner.buildPreview')).not.toBeInTheDocument()
  })
})
