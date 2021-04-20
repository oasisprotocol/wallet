/**
 *
 * ShortAddress
 *
 */
import * as React from 'react'

interface Props {
  address: string
}

export function ShortAddress(props: Props) {
  const a = props.address
  const short = `${a.slice(0, 10)}...${a.slice(-8)}`
  return <>{short}</>
}
