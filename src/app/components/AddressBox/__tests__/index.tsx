import * as React from 'react'
import copy from 'copy-to-clipboard'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AddressBox } from '../index'

jest.mock('copy-to-clipboard')

const testAddress = 'oasis1qqurxkgavtcjjytneumeclx59ds3avjaqg7ftqph'

const renderComponent = () => render(<AddressBox address={testAddress} />)

describe('<AddressBox />', () => {
  it('should render address properly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it('should be able to copy address to clipboard', async () => {
    renderComponent()
    await userEvent.click(screen.getByTestId('copy-address'))
    expect(copy).toHaveBeenCalledWith(testAddress)
  })
})
