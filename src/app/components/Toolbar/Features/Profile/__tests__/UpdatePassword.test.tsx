import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { persistActions } from 'app/state/persist'
import { UpdatePassword } from '../UpdatePassword'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <UpdatePassword />
      </ThemeProvider>
    </Provider>,
  )

describe('<UpdatePassword  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should dispatch action on submit', async () => {
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store)

    await userEvent.type(screen.getByPlaceholderText('toolbar.profile.password.current'), 'asd')
    await userEvent.type(screen.getByPlaceholderText('toolbar.profile.password.enterNewPassword'), '123')
    await userEvent.type(screen.getByPlaceholderText('toolbar.profile.password.reenterNewPassword'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'toolbar.profile.password.submit' }))
    expect(spy).toHaveBeenCalledWith({
      payload: {
        currentPassword: 'asd',
        password: '123',
      },
      type: persistActions.updatePasswordAsync.type,
    })
  })

  it('should clear redux password error', () => {
    const spy = jest.spyOn(store, 'dispatch')
    const { unmount } = renderComponent(store)

    unmount()
    expect(spy).toHaveBeenCalledWith({
      type: persistActions.resetWrongPassword.type,
    })
  })
})
