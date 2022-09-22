export function PasswordField() {
  return (
    <FormField
      htmlFor="privateKey"
      error={privateKeyIsValid === false ? t('openWallet.privateKey.error', 'Invalid private key') : ''}
      border
      contentProps={{ border: privateKeyIsValid ? false : 'bottom' }}
      round="small"
      width="xlarge"
    >
      <Box direction="row" align="center">
        <TextInput
          id="privatekey"
          data-testid="privatekey"
          placeholder={t('openWallet.privateKey.enterPrivateKeyHere', 'Enter your private key here')}
          value={privateKey}
          onChange={onChange}
          type={privateKeyIsVisible ? 'text' : 'password'}
          plain
        />
        <Tip
          content={
            privateKeyIsVisible
              ? t('openWallet.privateKey.hidePrivateKey', 'Hide private key')
              : t('openWallet.privateKey.showPrivateKey', 'Show private key')
          }
        >
          <Button
            onClick={() => setPrivateKeyIsVisible(!privateKeyIsVisible)}
            icon={privateKeyIsVisible ? <View /> : <Hide />}
          />
        </Tip>
      </Box>
    </FormField>
  )
}
