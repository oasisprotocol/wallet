/**
 *
 * Toolbar
 *
 */
import { selectHasAccounts } from 'app/state/wallet/selectors'
import { Box } from 'grommet/es6/components/Box'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import styled from 'styled-components'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectIsLockableOrCloseable } from 'app/state/selectIsLockableOrCloseable'
import { LanguageSelect } from 'app/components/LanguageSelect'
import { ProfileModalButton } from './Features/ProfileModalButton'
import { NetworkSelector } from './Features/NetworkSelector'
import { mobileToolbarButtonsZIndex } from '../../../styles/theme/elementSizes'

const StyledToolbar = styled(Box)`
  @media only screen and (min-width: ${({ theme }) => `${theme.global?.breakpoints?.small?.value}px`}) {
    padding: ${({ theme }) => `${theme.global?.edgeSize?.small} ${theme.global?.edgeSize?.small} 0`};
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.global?.breakpoints?.small?.value}px`}) {
    position: fixed;
    top: 0;
    right: 0;
    z-index: ${mobileToolbarButtonsZIndex};
    padding: ${({ theme }) => theme.global?.breakpoints?.small?.edgeSize?.small};
  }
`

export function Toolbar() {
  const hasAccounts = useSelector(selectHasAccounts)
  const isLockableOrCloseable = useSelector(selectIsLockableOrCloseable)
  const isMobile = React.useContext(ResponsiveContext) === 'small'

  return (
    <StyledToolbar
      direction="row"
      gap="small"
      justify="end"
      margin={{
        right:
          (!isLockableOrCloseable || isLockableOrCloseable === 'unlockable') && isMobile ? '30px' : 'none',
      }}
    >
      {(!isLockableOrCloseable || isLockableOrCloseable === 'unlockable') && !isMobile && (
        <Box style={{ marginTop: '2px', width: '220px' }}>
          <LanguageSelect />
        </Box>
      )}
      <Box
        background={isMobile ? 'transparent' : 'background-front'}
        justify="end"
        round="5px"
        border={{ color: 'background-front-border', size: isMobile ? 'none' : 'xsmall' }}
      >
        <NetworkSelector />
      </Box>

      {hasAccounts && (
        <Box justify="center">
          <ProfileModalButton />
        </Box>
      )}
    </StyledToolbar>
  )
}
