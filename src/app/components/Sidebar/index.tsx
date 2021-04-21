import { walletActions } from 'app/state/wallet'
import { selectAddress, selectStatus } from 'app/state/wallet/selectors'
import {
  Avatar,
  Box,
  Button,
  ButtonType,
  Layer,
  Menu,
  Nav,
  ResponsiveContext,
  Sidebar as GSidebar,
  Text,
  Tip,
} from 'grommet'
import { FormDown, Home, Language, LineChart, Logout, Menu as MenuIcon, Money } from 'grommet-icons/icons'
import * as React from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useHistory, useLocation } from 'react-router-dom'

interface SidebarButtonProps extends ButtonType {
  secure?: boolean
  route?: string
  label: string
}

const SidebarButton = ({ secure, icon, label, route, ...rest }: SidebarButtonProps) => {
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
      background={isActive ? 'brand' : 'neutral-2'}
      round={{ size: 'medium', corner: 'right' }}
    >
      {label}
    </Box>
  )

  const component = (
    <Tip content={isMediumSize ? tooltip : undefined} dropProps={{ align: { left: 'right' } }} plain={true}>
      <Box
        pad={{ vertical: 'small', left: isMediumSize ? 'none' : 'medium' }}
        background={isActive ? 'brand' : undefined}
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

const src = 'https://avatars.githubusercontent.com/u/52803776?s=200&v=4'

interface SidebarHeaderProps {
  size: string
}

interface SidebarFooterProps {
  size: string
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
      gap="small"
      direction="row"
      margin={{ bottom: size !== 'small' ? 'medium' : undefined }}
      pad="medium"
      alignSelf={size !== 'medium' ? undefined : 'center'}
    >
      <Avatar src={src} size={sizeLogo[size]} />
      {size !== 'medium' && <Text>Oasis Wallet</Text>}
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
    <Nav gap="medium">
      <SidebarButton icon={<Logout />} label={t('menu.closeWallet')} secure={true} onClick={() => logout()} />
      <Box pad={{ horizontal: 'small' }} align="center">
        <Menu
          hoverIndicator={false}
          dropProps={{ align: { bottom: 'bottom', left: 'left' } }}
          items={[
            { label: 'Français', onClick: () => setLanguage('fr') },
            { label: 'English', onClick: () => setLanguage('en') },
          ]}
        >
          <Box direction="row" round="4px" border={{ color: 'light-2' }}>
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
    </Nav>
  )
}

function SidebarMenuItems() {
  const address = useSelector(selectAddress)
  const { t } = useTranslation()

  const menu = {
    home: <SidebarButton icon={<Home />} label={t('menu.home')} route="/" />,
    wallet: (
      <SidebarButton icon={<Money />} label={t('menu.wallet')} secure={true} route={`/account/${address}`} />
    ),
    stake: <SidebarButton icon={<LineChart />} label={t('menu.stake')} secure={true} route="/stake" />,
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
  const size = useContext(ResponsiveContext)

  return (
    <GSidebar
      background="neutral-2"
      header={<SidebarHeader size={size} />}
      footer={<SidebarFooter size={size} />}
      pad={{ left: 'none', right: 'none', vertical: 'medium' }}
      width={size === 'medium' ? undefined : '220px'}
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
        <Box background="neutral-2" height="64px" fill="horizontal" direction="row" justify="between">
          <Box justify="center">
            <SidebarHeader size="small" />
          </Box>
          <Button onClick={() => toggleSidebar()} icon={<MenuIcon />} focusIndicator={false} />
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
