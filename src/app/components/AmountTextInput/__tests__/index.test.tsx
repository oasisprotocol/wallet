import * as React from 'react'
import { render } from '@testing-library/react'

import { FormTextInputWithFillButton } from '..'

describe('<FormTextInputWithFillButton  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<FormTextInputWithFillButton />)
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
