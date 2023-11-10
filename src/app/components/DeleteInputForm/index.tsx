import { ReactNode } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { useTranslation } from 'react-i18next'
import { TextInput } from 'grommet/es6/components/TextInput'
import { Form } from 'grommet/es6/components/Form'
import { FormField } from 'grommet/es6/components/FormField'

interface DeleteInputFormProps {
  children: ReactNode
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteInputForm({ children, onCancel, onConfirm }: DeleteInputFormProps) {
  const { t } = useTranslation()

  return (
    <Form onSubmit={onConfirm}>
      {children}
      <FormField
        name="type_delete"
        validate={(value: string | undefined) =>
          !value || value.toLowerCase() !== t('deleteForm.confirmationKeyword', 'delete').toLowerCase()
            ? t('deleteForm.hint', `Type '{{confirmationKeyword}}'`, {
                confirmationKeyword: t('deleteForm.confirmationKeyword', 'delete'),
              })
            : undefined
        }
      >
        <TextInput id="type_delete" name="type_delete" />
      </FormField>

      <Box direction="row" justify="between" pad={{ top: 'large' }}>
        <Button secondary label={t('common.cancel', 'Cancel')} onClick={onCancel} />
        <Button type="submit" label={t('deleteForm.confirm', 'Yes, delete')} primary color="status-error" />
      </Box>
    </Form>
  )
}
