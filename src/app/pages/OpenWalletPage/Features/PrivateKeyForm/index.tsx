import React, { useState } from 'react'
import { Box, Form, Heading, Paragraph, FormField, Button, TextInput, Tip } from 'grommet'
import { View, Hide } from 'grommet-icons/icons'
import { useTranslation } from 'react-i18next'

interface PrivateKeyFormProps {
  description: string
  isValid: boolean
  heading: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  value: string
}

export function PrivateKeyForm({
  description,
  isValid,
  heading,
  onChange,
  onSubmit,
  value,
}: PrivateKeyFormProps) {
  const { t } = useTranslation()
  const [privateKeyIsVisible, setPrivateKeyIsVisible] = useState(false)

  return (
    <Box
      background="background-front"
      border={{ color: 'background-front-border', size: '1px' }}
      margin="small"
      pad="medium"
      round="5px"
    >
      <Form onSubmit={onSubmit}>
        <Heading margin="0">{heading}</Heading>
        <Paragraph>
          <label htmlFor="privatekey">{description}</label>
        </Paragraph>
        <FormField
          border
          contentProps={{ border: isValid ? false : 'bottom' }}
          error={!isValid ? t('openWallet.privateKeyForm.error', 'Invalid private key') : ''}
          htmlFor="privateKey"
          round="small"
          width="xlarge"
        >
          <Box direction="row" align="center">
            <TextInput
              id="privatekey"
              onChange={onChange}
              placeholder={t('openWallet.privateKeyForm.enterPrivateKeyHere', 'Enter your private key here')}
              plain
              type={privateKeyIsVisible ? 'text' : 'password'}
              value={value}
            />
            <Tip
              content={
                privateKeyIsVisible
                  ? t('openWallet.privateKeyForm.hidePrivateKey', 'Hide private key')
                  : t('openWallet.privateKeyForm.showPrivateKey', 'Show private key')
              }
            >
              <Button
                data-testid="private-key-visibility"
                onClick={() => setPrivateKeyIsVisible(!privateKeyIsVisible)}
                icon={privateKeyIsVisible ? <View /> : <Hide />}
              />
            </Tip>
          </Box>
        </FormField>
        <Box pad={{ vertical: 'medium' }}>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button
              type="submit"
              label={t('openWallet.import', 'Import my wallet')}
              style={{ borderRadius: '4px' }}
              primary
            />
          </Box>
        </Box>
      </Form>
    </Box>
  )
}
