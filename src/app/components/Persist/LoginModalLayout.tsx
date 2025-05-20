import { Box } from 'grommet/es6/components/Box'
import { ResponsiveLayer } from '../ResponsiveLayer'
import React, { useContext } from 'react'
import { Header } from 'app/components/Header'
import { Navigation } from '../Sidebar'
import { ThemeContext } from 'styled-components'

const walletBlueLogotype = new URL('../../../../public/Rose Wallet Blue.svg', import.meta.url).href
const walletWhiteLogotype = new URL('../../../../public/Rose Wallet White.svg', import.meta.url).href

export function LoginModalLayout(props: {
  title: string
  children: React.ReactNode
  onClickOutside?: () => void
  onEsc?: () => void
}) {
  const { dark } = useContext<any>(ThemeContext)

  return (
    <Box direction="row-responsive" background="background-back" fill style={{ minHeight: '100dvh' }}>
      <Navigation />
      <ResponsiveLayer
        modal
        responsive={false}
        style={{
          width: '100%',
          maxWidth: '500px',
        }}
        background="background-front"
        onClickOutside={props.onClickOutside}
        onEsc={props.onEsc}
      >
        <Box pad="medium">
          <Box align="center" margin={{ vertical: 'large' }}>
            <img
              alt="ROSE Wallet logo"
              src={dark ? walletWhiteLogotype : walletBlueLogotype}
              style={{ height: '60px' }}
            />
          </Box>

          <Header fill textAlign="center">
            {props.title}
          </Header>

          {props.children}
        </Box>
      </ResponsiveLayer>
    </Box>
  )
}
