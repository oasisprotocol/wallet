import React from 'react'
import { render } from '@testing-library/react'
import { ExtensionRequestLedgerPermissionPopup } from '..'

jest.mock('app/lib/ledger')

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}))

describe('<ExtensionRequestLedgerPermissionPopup />', () => {
  it('should render component', () => {
    const { container } = render(<ExtensionRequestLedgerPermissionPopup />)

    expect(container).toMatchSnapshot()
  })
})
