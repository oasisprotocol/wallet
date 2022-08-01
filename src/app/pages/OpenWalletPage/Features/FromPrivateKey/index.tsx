import React, { useState } from 'react'
import { walletActions } from 'app/state/wallet'
import { useDispatch } from 'react-redux'
import { OasisKey } from 'app/lib/key'
import { base64ToUint, uint2hex } from 'app/lib/helpers'
import { useTranslation } from 'react-i18next'

import { PrivateKeyForm } from '../PrivateKeyForm'

const parseKey = (key: string) => {
  const keyWithoutEnvelope = key
    .replace(/\n/gm, '')
    .replace(/ /g, '')
    .replace(/^-----.*?-----/, '')
    .replace(/-----.*?-----$/, '')

  const key_bytes = base64ToUint(keyWithoutEnvelope)
  return OasisKey.fromPrivateKey(key_bytes)
}

export function FromPrivateKey() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [privateKey, setPrivateKey] = useState('')
  const [privateKeyIsValid, setPrivateKeyIsValid] = useState(true)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setPrivateKey(event.target.value)
  const onSubmit = () => {
    try {
      const secret = parseKey(privateKey)
      setPrivateKeyIsValid(true)
      dispatch(walletActions.openWalletFromPrivateKey(uint2hex(secret)))
    } catch (e) {
      setPrivateKeyIsValid(false)
    }
  }

  return (
    <PrivateKeyForm
      description={t('openWallet.privateKey.instruction', 'Enter your private key in Base64 format.')}
      isValid={privateKeyIsValid}
      heading={t('openWallet.privateKey.header', 'Enter your private key')}
      onChange={onChange}
      onSubmit={onSubmit}
      value={privateKey}
    />
  )
}
