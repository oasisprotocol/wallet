import { Box } from 'grommet/es6/components/Box'
import { ResponsiveLayer } from '../ResponsiveLayer'
import React from 'react'
import { Header } from 'app/components/Header'
import { Navigation } from '../Sidebar'

export function LoginModalLayout(props: {
  title: string
  children: React.ReactNode
  onClickOutside?: () => void
  onEsc?: () => void
}) {
  return (
    <Box direction="row-responsive" background="background-back" fill style={{ minHeight: '100dvh' }}>
      <Navigation />
      <ResponsiveLayer
        modal
        background="background-front"
        onClickOutside={props.onClickOutside}
        onEsc={props.onEsc}
      >
        <Box pad="medium">
          <Header level={2} textAlign="center" margin={{ top: 'medium' }}>
            {props.title}
          </Header>

          {props.children}
        </Box>
      </ResponsiveLayer>
    </Box>
  )
}
