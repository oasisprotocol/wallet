/**
 *
 * NetworkSelector
 *
 */
import { networkActions } from 'app/state/network'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { NetworkType } from 'app/state/network/types'
import { Box } from 'grommet/es6/components/Box'
import { Menu } from 'grommet/es6/components/Menu'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Network } from 'grommet-icons/es6/icons/Network'
import React, { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface Props {}

export const NetworkSelector = memo((props: Props) => {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)
  const selectedNetworkType = useSelector(selectSelectedNetwork)
  const dispatch = useDispatch()

  const switchNetwork = (network: NetworkType) => {
    dispatch(networkActions.selectNetwork(network))
  }

  const networkLabels = {
    local: t('toolbar.networks.local', 'Local'),
    mainnet: t('toolbar.networks.mainnet', 'Mainnet'),
    testnet: t('toolbar.networks.testnet', 'Testnet'),
  }

  const network = networkLabels[selectedNetworkType]
  const menuItems = [
    {
      label: networkLabels['mainnet'],
      onClick: () => {
        switchNetwork('mainnet')
      },
    },
    {
      label: networkLabels['testnet'],
      onClick: () => {
        switchNetwork('testnet')
      },
    },
  ]

  if (process.env.REACT_APP_LOCALNET) {
    menuItems.push({
      label: networkLabels['local'],
      onClick: () => {
        switchNetwork('local')
      },
    })
  }

  return (
    <Menu
      size="small"
      style={{ border: 0 }}
      dropProps={{
        align: { top: 'bottom', left: 'left' },
        elevation: 'xlarge',
      }}
      items={menuItems}
      fill
      a11yTitle={t('toolbar.networks.selector', 'Select network')}
    >
      <Box direction="row" gap="small" pad="small" responsive={false} data-testid="network-selector">
        <Network />
        {size !== 'small' && <Text data-testid="active-network">{network}</Text>}
      </Box>
    </Menu>
  )
})
