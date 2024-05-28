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

    numberInput.blur = jest.fn()
    const focusMock = jest.spyOn(numberInput, 'focus')

    act(() => {
      fireEvent.focus(numberInput)
      fireEvent.wheel(numberInput)
    })

    expect(numberInput.blur).toHaveBeenCalled()
    await waitFor(() => expect(focusMock).toHaveBeenCalled())
  })

  it('Should not focus on input that is not focused', async () => {
    const { getByRole } = render(<TextInputFormItem />)

    const numberInput = getByRole('input')

    numberInput.blur = jest.fn()
    const focusMock = jest.spyOn(numberInput, 'focus')

    act(() => {
      fireEvent.wheel(numberInput)
    })

    expect(numberInput.blur).toHaveBeenCalled()
    await waitFor(() => expect(focusMock).not.toHaveBeenCalled())
  })
})
