/**
 *
 * PrettyAddress
 *
 */
import React, { memo } from 'react'

interface Props {
  address: string
}

/**
 * Renders a bech32 address split by 4-character blocks
 */
export const PrettyAddress = memo((props: Props) => {
  const addr = props.address
  let prettyAddress = addr

  // Bech32 - 1 is used to split the HRP and the pub key
  if (addr.match(/^oasis1/)) {
    const parts = addr.split('1')

    const hrp = parts[0]
    const publicKey = parts[1].match(/.{1,4}/g)?.join(' ')
    prettyAddress = `${hrp}1 ${publicKey}`
  }

  return <>{prettyAddress}</>
})
