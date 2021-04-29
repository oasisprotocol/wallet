/**
 *
 * Toolbar
 *
 */
import { selectStatus } from 'app/state/wallet/selectors'
import { Box } from 'grommet'
import * as React from 'react'
import { useSelector } from 'react-redux'

import { AccountSelectorButton } from './Features/AccountSelectorButton'
import { NetworkSelector } from './Features/NetworkSelector'
import { SearchAddress } from './Features/SearchAddress'

interface Props {}

export function Toolbar(props: Props) {
  const isOpen = useSelector(selectStatus)

  return (
    <Box
      width="100%"
      background="component-toolbar"
      direction="row"
      height={{ min: 'auto' }}
      pad="small"
      gap="small"
    >
      <Box gap="medium" flex>
        <SearchAddress />
      </Box>
      {isOpen && (
        <Box justify="end" round="3px" border={{ size: '1px' }} data-testid="account-selector">
          <AccountSelectorButton />
        </Box>
      )}
      <Box justify="end" round="3px" border={{ size: '1px' }}>
        <NetworkSelector />
      </Box>
    </Box>
  )
}
