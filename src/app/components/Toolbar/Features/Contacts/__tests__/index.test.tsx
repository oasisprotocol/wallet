import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { Contacts } from '../'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Contacts />
      </ThemeProvider>
    </Provider>,
  )

describe('<Contacts  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const storeWithContacts = configureAppStore({
      contacts: {
        oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4: {
          address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
          name: 'My Contact',
        },
      },
    })
    const { container } = renderComponent(storeWithContacts)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should render empty state', () => {
    renderComponent(store)
    expect(screen.getByText('toolbar.contacts.emptyList')).toBeInTheDocument()
    expect(screen.getByText('toolbar.contacts.add')).toBeInTheDocument()
    expect(screen.queryByTestId('account-choice')).not.toBeInTheDocument()
  })

  it('should show Add Contact form overlay', async () => {
    renderComponent(store)
    await userEvent.click(screen.getByRole('button', { name: 'toolbar.contacts.add' }))
    expect(screen.getByPlaceholderText('toolbar.contacts.name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('toolbar.contacts.address')).toBeInTheDocument()
  })
})
