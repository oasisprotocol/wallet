import * as React from 'react'
import { render, act } from '@testing-library/react'
import { FromLedger } from '..'
import { MemoryRouter } from 'react-router-dom'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

describe('<FromLedger />', () => {
  it('should render component', async () => {
    const { container } = render(
      <MemoryRouter>
        <FromLedger />
      </MemoryRouter>,
    )

    await act(() => Promise.resolve())

    expect(container).toMatchSnapshot()
  })
})
