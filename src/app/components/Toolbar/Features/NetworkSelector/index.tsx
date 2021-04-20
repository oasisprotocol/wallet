/**
 *
 * NetworkSelector
 *
 */
import { Menu, Box, Text } from 'grommet'
import { Network } from 'grommet-icons/icons'
import React, { memo } from 'react'

interface Props {}

export const NetworkSelector = memo((props: Props) => {
  return (
    <Menu
      dropProps={{
        align: { top: 'bottom', left: 'left' },
        elevation: 'xlarge',
      }}
      items={[
        // { label: 'Mainnet', onClick: () => {} },
        { label: 'Testnet', onClick: () => {} },
      ]}
      fill
    >
      <Box direction="row" gap="small" pad="small">
        <Network />
        <Text>Testnet</Text>
      </Box>
    </Menu>
  )
})
