import React from 'react'
import { Heading, HeadingProps } from 'grommet'

interface HeaderProps extends Pick<HeadingProps, 'level' | 'size' | 'margin' | 'textAlign'> {
  children: React.ReactNode
}

export const Header = ({
  children,
  level = 1,
  size = 'small',
  margin = { top: 'none' },
  textAlign,
  ...props
}: HeaderProps) => (
  <Heading level={level} size={size} margin={margin} textAlign={textAlign} {...props}>
    {children}
  </Heading>
)

interface ModalHeaderProps {
  children: React.ReactNode
}
export const ModalHeader = ({ children, ...props }: ModalHeaderProps) => (
  <Header level={2} size="medium" {...props}>
    {children}
  </Header>
)
