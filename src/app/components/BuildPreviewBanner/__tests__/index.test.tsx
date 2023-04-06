import { render, screen } from '@testing-library/react'
import { BuildPreviewBanner } from '..'

describe('<BuildPreviewBanner />', () => {
  const env = process.env

  afterEach(() => {
    process.env = { ...env }
  })

  it('should render banner when env variable is provided', () => {
    process.env.REACT_APP_BUILD_PREVIEW = 'preview'
    render(<BuildPreviewBanner />)

    expect(screen.getByText('buildPreview')).toBeInTheDocument()
  })

  it('should not render banner', () => {
    process.env.REACT_APP_BUILD_PREVIEW = undefined
    render(<BuildPreviewBanner />)

    expect(screen.queryByText('buildPreview')).not.toBeInTheDocument()
  })
})
