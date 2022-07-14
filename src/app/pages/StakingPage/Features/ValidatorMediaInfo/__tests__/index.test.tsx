import { render, screen } from '@testing-library/react'
import * as React from 'react'

import { ValidatorMediaInfo } from '..'

describe('<ValidatorMediaInfo />', () => {
  it('should match snapshot', () => {
    const component = render(
      <ValidatorMediaInfo
        mediaInfo={{
          logotype: 'https://s3.amazonaws.com/s.jpg',
          website_link: 'https://s.f',
          twitter_acc: 'https://twitter.com/s',
          email_address: 's@s.f',
        }}
      />,
    )
    expect(component.baseElement).toMatchSnapshot()
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

  it('should display an email if the address is valid', () => {
    render(<ValidatorMediaInfo mediaInfo={{ email_address: 'test@test.com' }} />)
    const el = screen.getByRole('link')
    expect(el).toHaveAttribute('href', 'mailto:test@test.com')
  })

  it('should not display the email if the address is dangerous', () => {
    render(<ValidatorMediaInfo mediaInfo={{ email_address: 'test@test.com?attach=dangerouspayload' }} />)
    const el = screen.queryByRole('link')
    expect(el).toBeNull()
  })
})
