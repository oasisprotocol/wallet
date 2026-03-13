import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SelectOpenMethod } from '..'

jest.mock('app/lib/ledger', () => ({
  ...jest.requireActual('app/lib/ledger'),
  canAccessBle: jest.fn().mockResolvedValue(false),
  canAccessNavigatorUsb: jest.fn().mockResolvedValue(false),
}))
jest.mock('app/lib/runtimeIs', () => ({
  runtimeIs: 'extension',
}))
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}))
jest.mock('app/lib/ledger')

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}))

const renderComponent = () =>
  render(
    <MemoryRouter>
      <SelectOpenMethod />
    </MemoryRouter>,
  )

describe('<SelectOpenMethod />', () => {
  it('should render component', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })
})
