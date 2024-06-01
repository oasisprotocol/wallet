import { render, fireEvent, act, waitFor } from '@testing-library/react'
import { TextInput } from 'grommet/es6/components/TextInput'
import { usePreventChangeOnNumberInputScroll } from '../usePreventChangeOnNumberInputScroll'

const TextInputFormItem = () => (
  <TextInput role="input" type="number" {...usePreventChangeOnNumberInputScroll()} />
)

describe('usePreventChangeOnNumberInputScroll', () => {
  it('Should focus on input that is already in focus', async () => {
    const { getByRole } = render(<TextInputFormItem />)

    const numberInput = getByRole('input')
    fireEvent.change(numberInput, { target: { value: '123' } })

    act(() => {
      fireEvent.focus(numberInput)
      fireEvent.wheel(numberInput)
    })

    waitFor(() => expect(numberInput).toHaveFocus())
    expect(numberInput).toHaveValue(123)
  })

  it('Should not focus on input that is not focused', async () => {
    const { getByRole } = render(<TextInputFormItem />)

    const numberInput = getByRole('input')

    act(() => {
      fireEvent.wheel(numberInput)
    })

    expect(numberInput).not.toHaveFocus()
  })
})
