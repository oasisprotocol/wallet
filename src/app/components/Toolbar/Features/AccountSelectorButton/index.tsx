/**
 *
 * AccountSelectorButton
 *
 */
import { ShortAddress } from 'app/components/ShortAddress'
import { selectAddress } from 'app/state/wallet/selectors'
import { Box, Button, Heading, Layer, Text } from 'grommet'
import { List } from 'grommet-icons/icons'
import React, { memo, useState } from 'react'
import { useSelector } from 'react-redux'

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
      {layerVisibility && (
        <Layer
          onClickOutside={() => setLayerVisibility(false)}
          onEsc={() => setLayerVisibility(false)}
          animation="slide"
          background="light-2"
          modal
        >
          <Box background="light-2" pad="large">
            <Heading size="1" margin={{ vertical: 'small' }}>
              Switch to another account
            </Heading>
            <Text>Feature coming soon</Text>
            <Box align="end">
              <Button
                primary
                style={{ borderRadius: '4px' }}
                label="Close"
                onClick={() => setLayerVisibility(false)}
              />
            </Box>
          </Box>
        </Layer>
      )}
    </>
  )
})
