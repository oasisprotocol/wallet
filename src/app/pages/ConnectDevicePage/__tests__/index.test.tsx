import React from 'react'
import { render } from '@testing-library/react'
import { ConnectDevicePage } from '..'

jest.mock('app/lib/ledger')

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}))

describe('<ConnectDevicePage />', () => {
  it('should render component', () => {
    const { container } = render(<ConnectDevicePage />)

    expect(container).toMatchSnapshot()
  })
})
