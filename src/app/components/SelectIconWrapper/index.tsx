import { ReactNode } from 'react'
import styled from 'styled-components'
import { Box } from 'grommet/es6/components/Box'

const StyledBox = styled(Box)`
  position: relative;
  flex-direction: row;
`

const StyledIconContainer = styled(Box)`
  position: absolute;
  top: 10px;
  left: 12px;
`

interface SelectIconWrapperProps {
  children: ReactNode
  icon: ReactNode
}

export const SelectIconWrapper = ({ children, icon }: SelectIconWrapperProps) => {
  return (
    <StyledBox>
      <StyledIconContainer>{icon}</StyledIconContainer>
      {children}
    </StyledBox>
  )
}
