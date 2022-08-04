import * as React from 'react'
import { render } from '@testing-library/react'

import { ResponsiveGridRow } from '..'

describe('<ResponsiveGridRow />', () => {
  it('should render component', () => {
    const { container } = render(<ResponsiveGridRow label="Type" value="transfer" />)

    expect(container).toMatchSnapshot()
  })
})
