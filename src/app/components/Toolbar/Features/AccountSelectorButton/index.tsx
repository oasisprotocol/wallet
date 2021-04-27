/**
 *
 * AccountSelectorButton
 *
 */
import { ShortAddress } from 'app/components/ShortAddress'
import { selectAddress } from 'app/state/wallet/selectors'
import { Box, Button, Text } from 'grommet'
import { List } from 'grommet-icons/icons'
import React, { memo, useState } from 'react'
import { useSelector } from 'react-redux'

import { AccountSelector } from '../AccountSelector'

interface Props {}

export const AccountSelectorButton = memo((props: Props) => {
  const [layerVisibility, setLayerVisibility] = useState(false)
  const address = useSelector(selectAddress)

  return (
    <>
      <Button onClick={() => setLayerVisibility(true)}>
        <Box direction="row" gap="small" pad="small" responsive={false}>
          <List />
          <Text>
            <ShortAddress address={address} />
          </Text>
        </Box>
      </Button>
      {layerVisibility && <AccountSelector closeHandler={() => setLayerVisibility(false)} />}
    </>
  )
})
