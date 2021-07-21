import { render, screen } from '@testing-library/react'
import * as React from 'react'

import { ValidatorMediaInfo } from '..'

describe('<ValidatorMediaInfo />', () => {
  it('should match snapshot', () => {
    const component = render(<ValidatorMediaInfo mediaInfo={{}} />)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should display a link if the address is valid', () => {
    render(<ValidatorMediaInfo mediaInfo={{ website_link: 'http://www.google.fr/hello' }} />)
    const el = screen.getByRole('link')
    expect(el).toHaveAttribute('href', 'http://www.google.fr/hello')
  })

  it('should not display a link if the address is invalid', () => {
    // eslint-disable-next-line no-script-url
    render(<ValidatorMediaInfo mediaInfo={{ website_link: 'javascript:alert(1)' }} />)
    const el = screen.queryByRole('link')
    expect(el).toBeNull()
  })
})
