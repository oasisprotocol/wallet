/**
 *
 * PrettyAddress
 *
 */
import { NoTranslate } from 'app/components/NoTranslate'
import { isValidAddress } from 'app/lib/helpers'
import React, { memo } from 'react'
import { Text } from 'grommet/es6/components/Text'

interface Props {
  address: string
}

/**
 * Renders a bech32 address split by 4-character blocks
 */
export const PrettyAddress = memo((props: Props) => {
  // Bech32 - 1 is used to split the HRP and the pub key
  if (!props.address || props.address === '') {
    return <></>
  }

  if (isValidAddress(props.address)) {
    const parts = props.address.split('1')

    const hrp = parts[0]
    const publicKey = parts[1].match(/.{1,4}/g)?.join(' ')
    const prettyAddress = `${hrp}1 ${publicKey}`

    return (
      <Text style={{ fontFamily: 'Roboto mono' }}>
        <NoTranslate>{prettyAddress}</NoTranslate>
      </Text>
    )
  } else {
    throw new Error('Invalid bech32 address')
  }
})
