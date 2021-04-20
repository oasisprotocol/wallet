import { Box } from 'grommet'
import * as QRCode from 'qrcode.react'
import * as React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useWalletSlice } from '../../slice'
import { selectAddress } from '../../slice/selectors'

export function ExportWallet() {
  const { actions } = useWalletSlice()
  const dispatch = useDispatch()

  const address = useSelector(selectAddress)

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, [])
  }

  useEffectOnMount(() => {
    dispatch(actions.loadWallet())
  })

  return (
    <Box
      pad="medium"
      border={{ color: 'light-3', size: '1px' }}
      round="5px"
      background="white"
      direction="row-responsive"
    >
      <Box width="128">
        <QRCode value={address} css={{ width: '50%' }} size={128} />
      </Box>
      <Box fill="horizontal" pad={{ horizontal: 'small' }}>
        Scan this QR code to copy your public address.
      </Box>
    </Box>
  )
}
