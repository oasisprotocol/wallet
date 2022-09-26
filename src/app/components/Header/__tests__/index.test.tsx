import React from 'react'
import { render } from '@testing-library/react'

import { Header, ModalHeader } from '..'

describe('<Header />', () => {
  it('should render component', () => {
    const { container } = render(<Header>Title</Header>)

    expect(container).toMatchSnapshot()
  })
})

describe('<ModalHeader />', () => {
  it('should render component', () => {
    const { container } = render(<ModalHeader>Title</ModalHeader>)

    expect(container).toMatchSnapshot()
  })
})
