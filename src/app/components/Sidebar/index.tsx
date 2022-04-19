import { walletActions } from 'app/state/wallet'
import { selectAddress, selectStatus } from 'app/state/wallet/selectors'
import {
  Avatar,
  Box,
  Button,
  ButtonExtendedProps,
  Layer,
  Menu,
  Nav,
  ResponsiveContext,
  Sidebar as GSidebar,
  Text,
  Tip,
} from 'grommet'
import {
  Github,
  FormDown,
  Home,
  Language,
  LineChart,
  Logout,
  Menu as MenuIcon,
  Money,
} from 'grommet-icons/icons'
import * as React from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom'
import { ThemeSwitcher } from '../ThemeSwitcher'
import logotype from '../../../logo192.png'

interface SidebarButtonProps extends ButtonExtendedProps {
  secure?: boolean
  route?: string
  label: string
}

export const SidebarButton = ({ secure, icon, label, route, ...rest }: SidebarButtonProps) => {
  const status = useSelector(selectStatus)
  const size = useContext(ResponsiveContext)
  const location = useLocation()
  const isActive = route && route === location.pathname
  const isMediumSize = size === 'medium'

  if (!status && secure) {
    return null
  }

  const tooltip = (
    <Box
      pad={{ vertical: 'small', right: 'medium' }}
      margin="none"
      background={isActive ? 'background-oasis-blue' : 'component-sidebar'}
      round={{ size: 'medium', corner: 'right' }}
    >
      {label}
    </Box>
  )

  const component = (
    <Tip content={isMediumSize ? tooltip : undefined} dropProps={{ align: { left: 'right' } }} plain={true}>
      <Box
        pad={{ vertical: 'small', left: isMediumSize ? 'none' : 'medium' }}
        background={isActive ? 'background-oasis-blue' : undefined}
        responsive={false}
      >
        <Button
          a11yTitle={label}
          gap="medium"
          alignSelf={isMediumSize ? 'center' : 'start'}
          focusIndicator={false}
          plain
          icon={icon}
          label={!isMediumSize ? label : undefined}
          {...rest}
        />
      </Box>
    </Tip>
  )

  if (route) {
    return <NavLink to={route}>{component}</NavLink>
  }

  return component
}

type Size = 'small' | 'medium' | 'large'

interface SidebarHeaderProps {
  size: Size
}

interface SidebarFooterProps {
  size: Size
}

const SidebarHeader = (props: SidebarHeaderProps) => {
  const size = props.size
  const sizeLogo = {
    small: '30px',
    medium: '40px',
    large: 'medium',
  }

  return (
    <Box
      align="center"
      margin={{ bottom: size !== 'small' ? 'medium' : undefined }}
      pad="medium"
      alignSelf={size === 'large' ? undefined : 'center'}
    >
      <Link to="/">
        <Box align="center" direction="row" gap="small">
          <Avatar src={logotype} size={sizeLogo[size]} />
          {size !== 'medium' && <Text>Oasis Wallet</Text>}
        </Box>
      </Link>
    </Box>
  )
}

const SidebarFooter = (props: SidebarFooterProps) => {
  const { t, i18n } = useTranslation()
  const size = props.size
  const dispatch = useDispatch()
  const history = useHistory()

  const setLanguage = (ln: string) => {
    i18n.changeLanguage(ln)
  }

  const logout = () => {
    dispatch(walletActions.closeWallet())
    history.push('/')
  }

  return (
    <Nav gap="small">
      <ThemeSwitcher />
      <SidebarButton
        icon={<Logout />}
        label={t('menu.closeWallet', 'Close wallet')}
        secure={true}
        onClick={() => logout()}
      />
      <Box pad="small" align="center">
        <Menu
          hoverIndicator={false}
          dropProps={{ align: { bottom: 'bottom', left: 'left' } }}
          items={[
            { label: 'English', onClick: () => setLanguage('en') },
            { label: 'Français', onClick: () => setLanguage('fr') },
            { label: 'Slovenščina', onClick: () => setLanguage('sl') },
            { label: 'Türkçe', onClick: () => setLanguage('tr') },
          ]}
        >
          <Box direction="row" round="4px" border={{ size: '1px' }}>
            <Box pad="small">
              <Language />
            </Box>
            {size !== 'medium' && (
              <>
                <Box pad="small" flex="grow">
                  <Text>Language</Text>
                </Box>
                <Box pad="small">
                  <FormDown />
                </Box>
              </>
            )}
          </Box>
        </Menu>
      </Box>
      <Box align="center" pad="small">
        <a href="https://github.com/oasisprotocol/oasis-wallet-web" target="_blank" rel="noopener">
          <Github />
        </a>
      </Box>
    </Nav>
  )
}

function SidebarMenuItems() {
  const address = useSelector(selectAddress)
  const { t } = useTranslation()

  const menu = {
    home: <SidebarButton icon={<Home />} label={t('menu.home', 'Home')} route="/" data-testid="nav-home" />,
    wallet: (
      <SidebarButton
        icon={<Money />}
        label={t('menu.wallet', 'Wallet')}
        secure={true}
        route={`/account/${address}`}
        data-testid="nav-myaccount"
      />
    ),
    stake: (
      <SidebarButton
        icon={<LineChart />}
        label={t('menu.stake', 'Stake')}
        secure={true}
        route={`/account/${address}/stake`}
        data-testid="nav-stake"
      />
    ),
  }

  // Normal
  return (
    <Nav gap="small" pad="none">
      {menu.home}
      {menu.wallet}
      {menu.stake}
    </Nav>
  )
}

export function Sidebar() {
  const size = useContext(ResponsiveContext) as Size

  return (
    <GSidebar
      background="component-sidebar"
      header={<SidebarHeader size={size} />}
      footer={<SidebarFooter size={size} />}
      pad={{ left: 'none', right: 'none', vertical: 'medium' }}
      gap="small"
      width={size === 'medium' ? undefined : '220px'}
      border={{ side: 'end' }}
      // direction={size === 'small' ? 'row' : undefined}
      // height={size === 'small' ? '64px' : undefined}
    >
      <SidebarMenuItems />
    </GSidebar>
  )
}

export function Navigation() {
  const size = useContext(ResponsiveContext)
  const [sidebarVisible, setSidebarVisible] = React.useState(false)
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const location = useLocation()
  React.useEffect(() => {
    // If the location changed, hide the sidebar
    setSidebarVisible(false)
  }, [location])

  return (
    <>
      {size === 'small' && (
        <Box
          background="component-sidebar"
          height="64px"
          fill="horizontal"
          direction="row"
          style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 2,
          }}
        >
          <Button onClick={() => toggleSidebar()} icon={<MenuIcon />} focusIndicator={false} />
          <Box justify="center">
            <SidebarHeader size="small" />
          </Box>
        </Box>
      )}
      {size === 'small' && sidebarVisible && (
        <Layer
          position="left"
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
