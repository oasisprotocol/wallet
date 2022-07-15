import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'grommet'
import { LineChart, Money } from 'grommet-icons'
import styled from 'styled-components'
import { normalizeColor } from 'grommet/utils'
import { NavLink } from 'react-router-dom'
import { selectAddress } from 'app/state/wallet/selectors'

export const mobileFooterNavigationHeight = '4rem'
const StyledMobileFooterNavigation = styled.nav`
  background-color: ${({ theme }) => normalizeColor('background-front', theme)};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${mobileFooterNavigationHeight};
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  box-shadow: ${({ theme }) =>
    `0px 0px ${theme.global?.borderSize?.xsmall} ${normalizeColor('background-front-border', theme)}`};
  border-top: ${({ theme }) =>
    `solid ${theme.global?.borderSize?.xsmall} ${normalizeColor('background-contrast', theme)}`};
  flex-direction: row;
`

export interface MobileFooterNavigationProps {
  isAccountOpen: boolean
  isMobile: boolean
}

export const MobileFooterNavigation = ({ isAccountOpen, isMobile }: MobileFooterNavigationProps) => {
  const { t } = useTranslation()
  const address = useSelector(selectAddress)

  const getMenuItems = useMemo(() => {
    return [
      {
        label: t('menu.wallet', 'Wallet'),
        Icon: Money,
        to: `/account/${address}`,
      },
      {
        label: t('menu.stake', 'Stake'),
        Icon: LineChart,
        to: `/account/${address}/stake`,
      },
    ]
  }, [address, t])

  if (!isMobile || !isAccountOpen) {
    return null
  }

  return (
    <StyledMobileFooterNavigation data-testid="mobile-footer-navigation">
      {getMenuItems.map(({ label, Icon, to }) => (
        <NavLink to={to} key={to}>
          <Box as="span" justify="center" align="center" pad={{ horizontal: 'medium' }}>
            <Box as="span" margin="xsmall">
              <Icon />
            </Box>
            <Text size="small">{label}</Text>
          </Box>
        </NavLink>
      ))}
    </StyledMobileFooterNavigation>
  )
}
