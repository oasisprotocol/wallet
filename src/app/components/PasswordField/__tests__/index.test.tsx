import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, FormField, TextInput } from 'grommet'
import * as React from 'react'
import { PasswordField } from '..'

interface FormValue {
  name: string
  privateKey: string
}

describe('<PasswordField />', () => {
  it('with `name` and `validate`: validation error blocks submitting', async () => {
    function Example(props: { onSubmit: (value: FormValue) => void }) {
      return (
        <Form<FormValue>
          onSubmit={({ value }) => {
            expect(value.privateKey.length).toBeGreaterThanOrEqual(5)
            props.onSubmit(value)
          }}
        >
          <FormField name="name">
            <TextInput name="name" value="name" />
          </FormField>
          <PasswordField<FormValue>
            inputElementId="privateKey"
            name="privateKey"
            label="privateKey"
            autoComplete="current-password"
            validate={(privateKey, form) => {
              return privateKey.length < 5 ? 'invalid' : undefined
            }}
            showTip="show"
            hideTip="hide"
          />
          <input type="submit" />
        </Form>
      )
    }
    const onSubmit = jest.fn()
    render(<Example onSubmit={onSubmit}></Example>)

    await userEvent.type(screen.getByLabelText('privateKey'), 'a {Enter}')
    expect(await screen.findByText('invalid')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    await userEvent.type(screen.getByLabelText('privateKey'), 'privateKey{Enter}')
    expect(screen.queryByText('invalid')).not.toBeInTheDocument()
    expect(onSubmit).toHaveBeenLastCalledWith({ name: 'name', privateKey: 'a privateKey' })
  })

  it('with `value`, `onChange`, and `error`: validation error does NOT block submitting', async () => {
    function Example(props: { onSubmit: (value: FormValue) => void }) {
      const [privateKey, setPrivateKey] = React.useState('')
      const [name, setName] = React.useState('name')
      return (
        <Form
          onSubmit={() => {
            // Error doesn't block onSubmit
            // expect(privateKey.length).toBeGreaterThanOrEqual(5)
            props.onSubmit({ name, privateKey })
          }}
        >
          <FormField name="name">
            <TextInput name="name" value={name} onChange={event => setName(event.target.value)} />
          </FormField>
          <PasswordField
            inputElementId="privateKey"
            name="privateKey"
            label="privateKey"
            autoComplete="off"
            value={privateKey}
            onChange={event => setPrivateKey(event.target.value)}
            error={privateKey.length < 5 ? 'invalid' : undefined}
            showTip="show"
            hideTip="hide"
          />
          <input type="submit" />
        </Form>
      )
    }
    const onSubmit = jest.fn()
    render(<Example onSubmit={onSubmit}></Example>)

    await userEvent.type(screen.getByLabelText('privateKey'), 'a {Enter}')
    expect(await screen.findByText('invalid')).toBeInTheDocument()
    // Error doesn't block onSubmit
    expect(onSubmit).toHaveBeenLastCalledWith({ name: 'name', privateKey: 'a ' })

    await userEvent.type(screen.getByLabelText('privateKey'), 'privateKey{Enter}')
    expect(screen.queryByText('invalid')).not.toBeInTheDocument()
    expect(onSubmit).toHaveBeenLastCalledWith({ name: 'name', privateKey: 'a privateKey' })
  })
})
