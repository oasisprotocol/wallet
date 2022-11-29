import * as React from 'react'
import { render } from '@testing-library/react'
import { MnemonicGrid } from '..'

describe('<FromMnemonic/>', () => {
  it('should match snapshot', () => {
    const page = render(
      <MnemonicGrid
        mnemonic={[
          'planet',
          'beelieve', // Should mark typo
          'session',
        ]}
      />,
    )
    expect(page.container.firstChild).toMatchSnapshot()
  })
})
