/**
 *
 * AddressBox
 *
 */
import copy from 'copy-to-clipboard'
import { Box, Button, Text } from 'grommet'
import { Copy } from 'grommet-icons/icons'
import React, { memo } from 'react'

import { PrettyAddress } from '../PrettyAddress'

interface Props {
  address: string
}

export const AddressBox = memo((props: Props) => {
  const address = props.address

  const copyAddress = () => {
    copy(address)
  }

  return (
    <Box direction="row" align="center" round="5px" pad={{ right: 'small' }} width="fit-content">
      <Button onClick={() => copyAddress()} icon={<Copy size="18px" />} />
      <Text weight="bold" size="medium" wordBreak="break-word">
        <PrettyAddress address={address} />
      </Text>
    </Box>
  )
})
