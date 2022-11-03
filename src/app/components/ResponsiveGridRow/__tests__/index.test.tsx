import * as React from 'react'
import { render } from '@testing-library/react'

import { ResponsiveGridRow } from '..'

describe('<ResponsiveGridRow />', () => {
  it('should render component', () => {
    const { container } = render(<ResponsiveGridRow label="Type" value="transfer" />)

    expect(container).toMatchSnapshot()
  })

  it('should render component with a separator', () => {
    const { container } = render(<ResponsiveGridRow label="label" value="value" withSeparator />)

    expect(container).toMatchSnapshot()
  })
})
