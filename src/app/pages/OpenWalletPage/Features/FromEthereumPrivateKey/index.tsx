import { walletActions } from 'app/state/wallet'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isValidPrivateKey } from 'app/lib/eth-helpers'

import { PrivateKeyForm } from '../PrivateKeyForm'

export function FromEthereumPrivateKey() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [privateKey, setPrivateKey] = useState('')
  const [privateKeyIsValid, setPrivateKeyIsValid] = useState(true)
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!privateKeyIsValid) {
      setPrivateKeyIsValid(true)
    }
    setPrivateKey(event.target.value)
  }
  const onSubmit = () => {
    try {
      !isValidPrivateKey(privateKey)
        ? setPrivateKeyIsValid(false)
        : dispatch(walletActions.openWalletFromEthereumPrivateKey(privateKey))
    } catch {
      setPrivateKeyIsValid(false)
    }
  }

  return (
    <PrivateKeyForm
      description={t(
        'openWallet.ethereumPrivateKey.instruction',
        'Enter your Ethereum-compatible private key.',
      )}
      isValid={privateKeyIsValid}
      heading={t('openWallet.ethereumPrivateKey.header', 'Enter your Ethereum-compatible private key')}
      onChange={onChange}
      onSubmit={onSubmit}
      value={privateKey}
    />
  )
}
