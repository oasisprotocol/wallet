import React from 'react'
import { Box, Heading, HeadingProps, Text } from 'grommet'

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

interface ModalSplitHeaderProps {
  children: React.ReactNode
  side: React.ReactNode
}
export const ModalSplitHeader = ({ children, side }: ModalSplitHeaderProps) => (
  <Header level={2} size="medium">
    <Box direction="row-responsive" gap="medium" justify="between" align="baseline">
      {children}
      <Text weight="normal">{side}</Text>
    </Box>
  </Header>
)
