import React from 'react'
import { render, screen } from '@testing-library/react'

import { Header, ModalHeader } from '..'

describe('<Header />', () => {
  it('should render component', () => {
    const { container } = render(<Header>Title</Header>)

    expect(container).toMatchSnapshot()
  })

  it('should render header with text align property', () => {
    render(<Header textAlign="center">Title</Header>)

    expect(screen.queryByRole('heading')).toHaveStyle('text-align: center')
  })
})

describe('<ModalHeader />', () => {
  it('should render component', () => {
    const { container } = render(<ModalHeader>Title</ModalHeader>)

    expect(container).toMatchSnapshot()
  })
})
