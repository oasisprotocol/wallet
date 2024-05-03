import { Box } from 'grommet/es6/components/Box'
import { ResponsiveLayer } from '../ResponsiveLayer'
import React, { useContext } from 'react'
import { Header } from 'app/components/Header'
import { Navigation } from '../Sidebar'
import walletBlueLogotype from '../../../../public/Rose Wallet Logo Blue cropped.svg'
import walletWhiteLogotype from '../../../../public/Rose Wallet Logo White cropped.svg'
import { ThemeContext } from 'styled-components'

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

          <Header level={2} fill textAlign="center">
            {props.title}
          </Header>

          {props.children}
        </Box>
      </ResponsiveLayer>
    </Box>
  )
}
