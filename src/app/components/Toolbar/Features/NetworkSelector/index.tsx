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
import { SelectWithIcon } from '../../../SelectWithIcon'

function useNetworks() {
  const { t } = useTranslation()
  const selectedNetworkValue = useSelector(selectSelectedNetwork)
  const dispatch = useDispatch()

  const switchNetwork = (network: NetworkType) => {
    dispatch(networkActions.selectNetwork(network))
  }

  const networkLabels = {
    local: t('toolbar.networks.local', 'Local'),
    mainnet: t('toolbar.networks.mainnet', 'Mainnet'),
    testnet: t('toolbar.networks.testnet', 'Testnet'),
  }

  const selectedNetwork = {
    value: selectedNetworkValue,
    label: networkLabels[selectedNetworkValue],
  }

  const networks = [
    'mainnet' as const,
    'testnet' as const,
    ...(process.env.REACT_APP_LOCALNET ? ['local' as const] : []),
  ].map(value => ({
    value: value,
    label: networkLabels[value],
  }))

  return {
    networks,
    selectedNetwork,
    switchNetwork,
  }
}

export const NetworkSelect = () => {
  const { t } = useTranslation()
  const { networks, selectedNetwork, switchNetwork } = useNetworks()
  return (
    <SelectWithIcon
      icon={<Network size="24px" />}
      id="network"
      label={t('toolbar.networks.selector2', 'Network')}
      name="network"
      onChange={option => switchNetwork(option)}
      options={networks}
      value={selectedNetwork.value}
    />
  )
}

export const NetworkMenu = memo(() => {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)
  const { networks, selectedNetwork, switchNetwork } = useNetworks()

  return (
    <Menu
      size="small"
      style={{ border: 0 }}
      dropProps={{
        align: { top: 'bottom', left: 'left' },
        elevation: 'xlarge',
      }}
      items={networks.map(net => ({
        ...net,
        onClick: () => switchNetwork(net.value),
        primary: net.value === selectedNetwork.value,
      }))}
      fill
      a11yTitle={t('toolbar.networks.selector', 'Select network')}
    >
      <Box direction="row" gap="small" pad="small" responsive={false} data-testid="network-selector">
        <Network />
        {size !== 'small' && <Text data-testid="active-network">{selectedNetwork.label}</Text>}
      </Box>
    </Menu>
  )
})
