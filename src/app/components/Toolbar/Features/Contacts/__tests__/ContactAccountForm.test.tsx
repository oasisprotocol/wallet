import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { Contact } from 'app/state/contacts/types'
import { ContactAccountForm } from '../ContactAccountForm'

const contact = {
  address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
  name: 'My Contact',
}
const onCancel = jest.fn()
const onDelete = jest.fn()
const onSave = jest.fn()
const renderComponent = (store: any, contact?: Contact, onDelete?: () => void) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <ContactAccountForm onCancel={onCancel} onSave={onSave} contact={contact} onDelete={onDelete} />
      </ThemeProvider>
    </Provider>,
  )

describe('<ContactAccountForm  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should throw required field error', async () => {
    renderComponent(store)
    await userEvent.click(screen.getByRole('button', { name: 'toolbar.contacts.save' }))
    expect(screen.getAllByText('toolbar.contacts.validation.required').length).toEqual(2)
    expect(onSave).not.toHaveBeenCalled()
  })

  it('should throw name length error', async () => {
    renderComponent(store)
    await userEvent.type(screen.getByPlaceholderText('toolbar.contacts.name'), 'fooBarFooBarFooBar')
    await userEvent.click(screen.getByRole('button', { name: 'toolbar.contacts.save' }))
    expect(screen.getByText('toolbar.contacts.validation.nameLengthError')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('should throw address error', async () => {
    renderComponent(store)
    await userEvent.type(screen.getByPlaceholderText('toolbar.contacts.address'), 'fooBar')
    await userEvent.click(screen.getByRole('button', { name: 'toolbar.contacts.save' }))
    expect(screen.getByText('toolbar.contacts.validation.addressError')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('should throw unique address error', async () => {
    const storeWithContacts = configureAppStore({
      contacts: {
        oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4: contact,
      },
    })
    renderComponent(storeWithContacts)
    await userEvent.type(
      screen.getByPlaceholderText('toolbar.contacts.address'),
      'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
    )
    await userEvent.click(screen.getByRole('button', { name: 'toolbar.contacts.save' }))
    expect(screen.getByText('toolbar.contacts.validation.addressNotUniqueError')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('should submit a form', async () => {
    renderComponent(store)
    await userEvent.type(screen.getByPlaceholderText('toolbar.contacts.name'), 'FooBar')
    await userEvent.type(
      screen.getByPlaceholderText('toolbar.contacts.address'),
      'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
    )
    await userEvent.click(screen.getByRole('button', { name: 'toolbar.contacts.save' }))
    expect(onSave).toHaveBeenCalled()
  })

  it('should render a form in edit mode', async () => {
    renderComponent(store, contact, onDelete)
    expect(screen.getByPlaceholderText('toolbar.contacts.address')).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'toolbar.contacts.delete.button' }))
    expect(screen.getByText('toolbar.contacts.delete.title')).toBeInTheDocument()
  })
})
