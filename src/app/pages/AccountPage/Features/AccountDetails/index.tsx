/**
 *
 * AccountDetails
 *
 */
import { selectStatus } from 'app/state/wallet/selectors'
import { Box } from 'grommet'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { SendTransaction } from '../SendTransaction'
import { SendParatimeTransaction } from '../SendParatimeTransaction'
import { TransactionHistory } from '../TransactionHistory'

interface Props {}

export const AccountDetails = memo((props: Props) => {
  const walletIsOpen = useSelector(selectStatus)

  return (
    <Box direction="row-responsive" gap="small">
      {walletIsOpen && (
        <>
          <Box flex basis="1/4" width={{ min: '300px' }}>
            <SendTransaction />
          </Box>
          <Box flex basis="1/4" width={{ min: '300px' }}>
            <SendParatimeTransaction />
          </Box>
        </>
      )}
      <Box flex basis="3/4">
        <TransactionHistory />
      </Box>
    </Box>
  )
})
