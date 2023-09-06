import { Box } from 'grommet/es6/components/Box'
import { Layer } from 'grommet/es6/components/Layer'
import React from 'react'
import { Header } from 'app/components/Header'

export function LoginModalLayout(props: {
  title: string
  children: React.ReactNode
  onClickOutside?: () => void
  onEsc?: () => void
}) {
  return (
    <Layer modal background="background-front" onClickOutside={props.onClickOutside} onEsc={props.onEsc}>
      <Box pad="medium">
        <Header>{props.title}</Header>

        {props.children}
      </Box>
    </Layer>
  )
}
