/**
 *
 * AccountDetails
 *
 */
import { selectAddress, selectIsOpen } from 'app/state/wallet/selectors'
import { Box } from 'grommet'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { SendTransaction } from '../SendTransaction'
import { TransactionHistory } from '../TransactionHistory'
import { selectAccountAddress } from 'app/state/account/selectors'

interface Props {}

export const AccountDetails = memo((props: Props) => {
  const walletIsOpen = useSelector(selectIsOpen)
  const walletAddress = useSelector(selectAddress)
  const address = useSelector(selectAccountAddress)
  const isAddressInWallet = walletIsOpen && walletAddress === address

  return (
    <Box direction="row-responsive" gap="small">
      {isAddressInWallet && (
        <Box flex basis="1/4" width={{ min: '300px' }}>
          <SendTransaction isAddressInWallet={isAddressInWallet} />
        </Box>
      )}
      <Box flex basis="3/4">
        <TransactionHistory />
      </Box>
    </Box>
  )
})
