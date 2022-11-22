import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'
import { Form, FormField, TextInput } from 'grommet'
import * as React from 'react'
import { PasswordField } from '..'

interface FormValue {
  name: string
  privateKey: string
}
describe('type-only test', () => {
  describe('<PasswordField /> with `name`, `validate`, and `FormValue`', () => {
    it('is strictly typed', () => {
      expect(
        <Form<FormValue>
          onSubmit={({ value }) => {
            // @ts-expect-error Detect incorrect type
            expect(value.privateKey !== 5).toBeTruthy()
            expect(value.privateKey !== '5').toBeTruthy()
          }}
          {...preventSavingInputsToUserData}
        >
          <FormField name="name">
            <TextInput name="name" value="name" />
          </FormField>
          <PasswordField<FormValue>
            inputElementId="privateKey"
            name="privateKey"
            label="privateKey"
            validate={(privateKey, form) => {
              // @ts-expect-error Detect incorrect type
              expect(privateKey !== 5).toBeTruthy()
              expect(privateKey !== '5').toBeTruthy()

              // @ts-expect-error Detect missing field
              expect(form.privateKey2 !== '5').toBeTruthy()
              // @ts-expect-error Detect incorrect type
              expect(form.privateKey !== 5).toBeTruthy()
              expect(form.privateKey !== '5').toBeTruthy()
              expect(form.name !== '5').toBeTruthy()

              return privateKey.length < 5 ? 'invalid' : undefined
            }}
            showTip="show"
            hideTip="hide"
          />
          <PasswordField<FormValue>
            inputElementId="privateKey3"
            // @ts-expect-error Detect missing field
            name="privateKey3"
            showTip="show"
            hideTip="hide"
          />
          <input type="submit" />
        </Form>,
      ).toBeDefined()
    })

    it('less type-safe without `FormValue`', () => {
      expect(
        <Form
          onSubmit={({ value }) => {
            // @ts-expect-error Doesn't know about any fields
            expect(value.privateKey !== '5').toBeTruthy()
          }}
          {...preventSavingInputsToUserData}
        >
          <FormField name="name">
            <TextInput name="name" value="name" />
          </FormField>
          <PasswordField
            inputElementId="privateKey"
            name="privateKey"
            label="privateKey"
            validate={(privateKey, form) => {
              // @ts-expect-error Detect incorrect type
              expect(privateKey !== 5).toBeTruthy()
              expect(privateKey !== '5').toBeTruthy()

              // @ts-expect-error Detect missing field
              expect(form.privateKey2 !== '5').toBeTruthy()
              expect(form.privateKey !== '5').toBeTruthy()
              // @ts-expect-error Doesn't know about other fields
              expect(form.name !== '5').toBeTruthy()

              return privateKey.length < 5 ? 'invalid' : undefined
            }}
            showTip="show"
            hideTip="hide"
          />
          <input type="submit" />
        </Form>,
      ).toBeDefined()
    })
  })
})
