import { selectAddress, selectHasAccounts } from 'app/state/wallet/selectors'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Layer } from 'grommet/es6/components/Layer'
import { Menu } from 'grommet/es6/components/Menu'
import { Nav } from 'grommet/es6/components/Nav'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Sidebar as GSidebar } from 'grommet/es6/components/Sidebar'
import { Text } from 'grommet/es6/components/Text'
import { normalizeColor } from 'grommet/es6/utils'
import { Github } from 'grommet-icons/es6/icons/Github'
import { FormDown } from 'grommet-icons/es6/icons/FormDown'
import { Home } from 'grommet-icons/es6/icons/Home'
import { Inherit } from 'grommet-icons/es6/icons/Inherit'
import { LineChart } from 'grommet-icons/es6/icons/LineChart'
import { MuiLockIcon } from '../../../styles/theme/icons/mui-icons/MuiLockIcon'
import { Logout } from 'grommet-icons/es6/icons/Logout'
import { Menu as MenuIcon } from 'grommet-icons/es6/icons/Menu'
import { MuiWalletIcon } from '../../../styles/theme/icons/mui-icons/MuiWalletIcon'
import { CreditCard } from 'grommet-icons/es6/icons/CreditCard'
import * as React from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Language } from '../../../styles/theme/icons/language/Language'
import { useParaTimesNavigation } from 'app/pages/ParaTimesPage/useParaTimesNavigation'
import { ThemeSwitcher } from '../ThemeSwitcher'
import walletBlueLogotype from '../../../../public/Rose Wallet Blue.svg'
import walletWhiteLogotype from '../../../../public/Rose Wallet White.svg'
import { languageLabels } from '../../../locales/i18n'
import { selectIsLockableOrCloseable } from 'app/state/selectIsLockableOrCloseable'
import { persistActions } from 'app/state/persist'
import { IS_FIAT_ONRAMP_ENABLED } from '../../pages/FiatOnrampPage/isEnabled'
import {
  sidebarSmallSizeLogo,
  sidebarMediumSizeLogo,
  sidebarLargeSizeLogo,
  mobileToolbarZIndex,
} from '../../../styles/theme/elementSizes'
import styled, { ThemeContext } from 'styled-components'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { MobileFooterNavigation } from '../MobileFooterNavigation'

interface SidebarButtonBaseProps {
  needsWalletOpen?: boolean
  icon: JSX.Element
  label: string
}

type SidebarButtonProps = SidebarButtonBaseProps &
  (
    | { route: string; exactActive?: boolean; newTab?: boolean; onClick?: undefined }
    | {
        route?: undefined
        exactActive?: undefined
        newTab?: undefined
        onClick: React.MouseEventHandler<HTMLButtonElement> & React.MouseEventHandler<HTMLAnchorElement>
      }
  )

const UnstyledSidebarButton = ({
  needsWalletOpen,
  icon,
  label,
  route,
  newTab,
  exactActive,
  onClick,
  ...rest
}: SidebarButtonProps) => {
  const walletHasAccounts = useSelector(selectHasAccounts)

  if (!walletHasAccounts && needsWalletOpen) {
    return null
  }

  const component = (
    <Box
      pad={{ vertical: 'small', left: 'medium' }}
      responsive={false}
      direction="row"
      gap="medium"
      justify="start"
    >
      {icon}
      <Text>{label}</Text>
    </Box>
  )

  if (route) {
    const isAbsoluteUrl =
      route.startsWith('https://') || route.startsWith('http://') || route.startsWith('//')
    if (!newTab && isAbsoluteUrl) {
      throw new Error('Must use newTab with absolute URLs. React-router Link component uses relative routes.')
    }

    return newTab ? (
      <a aria-label={label} href={route} target="_blank" rel="noopener" {...rest}>
        {component}
      </a>
    ) : (
      <NavLink aria-label={label} to={route} end={exactActive} {...rest}>
        {component}
      </NavLink>
    )
  } else {
    return (
      <Button a11yTitle={label} fill="horizontal" onClick={onClick} {...rest}>
        {component}
      </Button>
    )
  }
}
export const SidebarButton = styled(UnstyledSidebarButton)`
  &:hover {
    color: ${({ theme }) => normalizeColor('text', theme)};
    background-color: ${({ theme }) => normalizeColor('active', theme)};
  }

  &.active {
    color: ${({ theme }) => normalizeColor('text', theme, true)};
    background-color: ${({ theme }) => normalizeColor('control', theme)};
  }
`

type Size = 'small' | 'medium' | 'large'

interface SidebarHeaderProps {
  size: Size
}

interface SidebarFooterProps {
  size: Size
}

const SidebarHeader = (props: SidebarHeaderProps) => {
  const { dark } = useContext<any>(ThemeContext)

  const size = props.size
  const sizeLogo = {
    small: `${sidebarSmallSizeLogo}px`,
    medium: `${sidebarMediumSizeLogo}px`,
    large: `${sidebarLargeSizeLogo}px`,
  }

  return (
    <Box
      align="center"
      margin={{ bottom: size !== 'small' ? 'medium' : undefined }}
      pad={{ horizontal: 'medium', vertical: 'small' }}
      alignSelf={size === 'large' ? undefined : 'center'}
    >
      <Link to="/">
        <img
          alt="ROSE Wallet logo"
          src={dark ? walletWhiteLogotype : walletBlueLogotype}
          style={{ height: sizeLogo[size] }}
        />
      </Link>
    </Box>
  )
}

const SidebarFooter = (props: SidebarFooterProps) => {
  const { t, i18n } = useTranslation()
  const size = props.size
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLockableOrCloseable = useSelector(selectIsLockableOrCloseable)

  const setLanguage = (ln: string) => {
    i18n.changeLanguage(ln)
  }

  const closeWallet = () => {
    navigate('/')
    dispatch(persistActions.lockAsync())
  }
  const lockProfile = () => {
    dispatch(persistActions.lockAsync())
  }

  return (
    <Nav gap="small">
      {!isLockableOrCloseable && <ThemeSwitcher />}
      {isLockableOrCloseable === 'closeable' && (
        <SidebarButton
          icon={<Logout />}
          label={t('menu.closeWallet', 'Close wallet')}
          onClick={() => closeWallet()}
        />
      )}
      {isLockableOrCloseable === 'unlockable' && (
        <SidebarButton
          icon={<Logout />}
          label={t('menu.unlockProfile', 'Unlock profile')}
          onClick={() => closeWallet()}
        />
      )}
      {isLockableOrCloseable === 'lockable' && (
        <SidebarButton
          icon={<MuiLockIcon />}
          label={t('menu.lockProfile', 'Lock profile')}
          onClick={() => lockProfile()}
        />
      )}

      {size === 'small' && (
        <Box pad="small" align="start">
          <Menu
            hoverIndicator={false}
            dropProps={{ align: { bottom: 'bottom', left: 'left' } }}
            items={languageLabels.map(([key, label]) => ({
              label: label,
              onClick: () => setLanguage(key),
            }))}
            a11yTitle="Language"
          >
            <Box direction="row">
              <Box pad="small">
                <Language />
              </Box>
              <Box pad="small" flex="grow">
                {/* Intentionally not translated */}
                <Text>Language</Text>
              </Box>
              <Box pad="small">
                <FormDown />
              </Box>
            </Box>
          </Menu>
        </Box>
      )}
      <SidebarButton
        icon={<Github />}
        label="GitHub"
        route="https://github.com/oasisprotocol/oasis-wallet-web"
        newTab
      ></SidebarButton>
    </Nav>
  )
}

/** See also {@link MobileFooterNavigation} */
function SidebarMenuItems() {
  const address = useSelector(selectAddress)
  const { t } = useTranslation()
  const { getParaTimesRoutePath, paraTimesRouteLabel } = useParaTimesNavigation()
  const menu = {
    home: (
      <SidebarButton
        icon={<Home />}
        label={t('menu.home', 'Home')}
        route="/"
        exactActive
        data-testid="nav-home"
      />
    ),
    wallet: (
      <SidebarButton
        icon={<MuiWalletIcon />}
        label={t('menu.wallet', 'Account')}
        needsWalletOpen={true}
        route={`/account/${address}`}
        exactActive
        data-testid="nav-myaccount"
      />
    ),
    stake: (
      <SidebarButton
        icon={<LineChart />}
        label={t('menu.stake', 'Stake ROSE')}
        needsWalletOpen={true}
        route={`/account/${address}/stake`}
        data-testid="nav-stake"
      />
    ),
    paraTimes: (
      <SidebarButton
        icon={<Inherit />}
        label={paraTimesRouteLabel}
        needsWalletOpen={true}
        route={getParaTimesRoutePath(address!)}
        data-testid="nav-paratime"
      />
    ),
    fiatOnramp: (
      <SidebarButton
        icon={<CreditCard />}
        label={t('menu.fiatOnramp', 'Buy ROSE')}
        needsWalletOpen={true}
        route={`/account/${address}/fiat`}
      />
    ),
  }

  return (
    <Nav gap="small" pad="none">
      {menu.home}
      {menu.wallet}
      {menu.stake}
      {menu.paraTimes}
      {/* eslint-disable-next-line no-restricted-syntax -- menu.fiatOnramp is not a plain text node */}
      {IS_FIAT_ONRAMP_ENABLED && menu.fiatOnramp}
    </Nav>
  )
}

export function Sidebar() {
  const size = useContext(ResponsiveContext) as Size

  return (
    <GSidebar
      background="component-sidebar"
      header={size !== 'small' ? <SidebarHeader size={size} /> : undefined}
      footer={<SidebarFooter size={size} />}
      pad={{ left: 'none', right: 'none', vertical: 'medium' }}
      gap="small"
      width="220px"
    >
      <SidebarMenuItems />
    </GSidebar>
  )
}

export function Navigation() {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)
  const [sidebarVisible, setSidebarVisible] = React.useState(false)
  const isLockableOrCloseable = useSelector(selectIsLockableOrCloseable)
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const location = useLocation()
  React.useEffect(() => {
    // If the location changed, hide the sidebar
    setSidebarVisible(false)
  }, [location])
  const hasMenuOnRightSide = !isLockableOrCloseable || isLockableOrCloseable === 'unlockable'

  return (
    <>
      {size === 'small' && (
        <Box
          background="background-front"
          border={{ color: 'background-contrast', side: 'bottom' }}
          height="64px"
          fill="horizontal"
          direction="row"
          style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: mobileToolbarZIndex,
            flexDirection: hasMenuOnRightSide ? 'row-reverse' : 'row',
            justifyContent: hasMenuOnRightSide ? 'space-between' : 'flex-start',
          }}
        >
          {hasMenuOnRightSide && (
            <Button
              onClick={() => toggleSidebar()}
              a11yTitle={t('menu.openMenu', 'Menu')}
              icon={<MenuIcon />}
              focusIndicator={false}
            />
          )}
          <Box justify="center">
            <SidebarHeader size="small" />
          </Box>
        </Box>
      )}
      {size === 'small' && sidebarVisible && (
        <Layer
          position="right"
          onClickOutside={toggleSidebar}
          onEsc={toggleSidebar}
          full="vertical"
          modal
          animation="slide"
          responsive={false}
        >
          <Sidebar />
        </Layer>
      )}
      {size !== 'small' && <Sidebar />}
    </>
  )
}
