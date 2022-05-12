import * as React from 'react'
import { createRenderer } from 'react-test-renderer/shallow'

import { App } from '../index'
import { useRouteRedirects } from '../useRouteRedirects'

const renderer = createRenderer()

jest.mock('../useRouteRedirects')

describe('<App />', () => {
  it('should render and match the snapshot', () => {
    renderer.render(<App />)

    const renderedOutput = renderer.getRenderOutput()
    expect(useRouteRedirects).toHaveBeenCalled()
    expect(renderedOutput).toMatchSnapshot()
  })
})
