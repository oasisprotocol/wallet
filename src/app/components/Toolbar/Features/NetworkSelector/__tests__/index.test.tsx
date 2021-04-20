import * as React from 'react'
import { render } from '@testing-library/react'

import { NetworkSelector } from '..'

describe('<NetworkSelector  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<NetworkSelector />)
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
