import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { lazyLoad } from 'utils/loadable'

const LoadingIndicator = () => <div>Loading</div>

const LazyComponenWithDefaultExport = lazyLoad(() => import('../../../internals/testing/loadable.mock'))

const LazyComponentWithExportedFunction = lazyLoad(
  () => import('../../../internals/testing/loadable.mock'),
  module => module.ExportedFunc,
)

const LazyComponentWithFallback = lazyLoad(
  () => import('../../../internals/testing/loadable.mock'),
  undefined,
  {
    fallback: <LoadingIndicator />,
  },
)

describe('loadable', () => {
  it('should render null by default', () => {
    const {
      container: { firstChild },
    } = render(<LazyComponenWithDefaultExport />)
    expect(firstChild).toMatchSnapshot()
  })

  it('should render null by default with empty options', () => {
    const {
      container: { firstChild },
    } = render(<LazyComponentWithExportedFunction />)
    expect(firstChild).toMatchSnapshot()
  })

  it('should render fallback if given one', () => {
    const {
      container: { firstChild },
    } = render(<LazyComponentWithFallback />)
    expect(firstChild).toMatchSnapshot()
  })

  it('should render LazyComponent after waiting for it to load', async () => {
    const component = render(<LazyComponentWithExportedFunction />)
    expect(await screen.findByText(/lazy-loaded/)).toBeInTheDocument()
    expect(component.container.firstChild).toMatchSnapshot()
  })
})
