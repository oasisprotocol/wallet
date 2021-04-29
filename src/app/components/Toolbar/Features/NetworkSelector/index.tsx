/**
 *
 * NetworkSelector
 *
 */
import { Menu, Box, Text, ResponsiveContext } from 'grommet'
import { Network } from 'grommet-icons/icons'
import React, { memo, useContext } from 'react'

interface Props {}

export const NetworkSelector = memo((props: Props) => {
  const size = useContext(ResponsiveContext)

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
      <Box direction="row" gap="small" pad="small" responsive={false}>
        <Network />
        {size !== 'small' && <Text>Testnet</Text>}
      </Box>
    </Menu>
  )
})
