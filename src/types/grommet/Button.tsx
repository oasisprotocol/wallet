// eslint-disable-next-line no-restricted-imports
import { Button as ButtonOriginal, ButtonExtendedProps } from 'grommet'

export function Button<T extends ButtonExtendedProps>(
  props: T extends { type: 'submit'; onClick: any }
    ? 'Replace <Button type="submit" onClick> with <Form onSubmit>'
    : T,
) {
  return <ButtonOriginal {...props}></ButtonOriginal>
}
