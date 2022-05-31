import { Box, Button, TextInput } from 'grommet'
import { FormClose, Search } from 'grommet-icons/icons'
import React from 'react'
import styled from 'styled-components'

interface Props {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

const RightIconButton = styled(Button)`
  margin-left: ${({ theme }) => {
    const negativeIconButtonWidth = `calc(-${theme.global?.edgeSize?.small} - ${theme.icon?.size?.medium} - ${theme.global?.edgeSize?.small})`
    return negativeIconButtonWidth
  }};
  z-index: 1;
`

/**
 * Rounded input with search icon and clear button.
 */
export const SearchBox = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { placeholder, value, onChange, onClear, ...rest } = props
  const borderRadius = '30px'
  return (
    <Box
      round={borderRadius}
      border={{ size: '1px' }}
      fill="vertical"
      justify="center"
      align="center"
      width={{ max: '600px' }}
      direction="row"
    >
      <TextInput
        style={{ borderRadius: borderRadius }}
        plain
        icon={<Search />}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={
          <Box margin={{ left: '36px' }} max-height="30px" style={{ textOverflow: 'ellipsis' }} flex="shrink">
            {placeholder}
          </Box>
        }
        ref={ref}
        {...rest}
      />
      <RightIconButton
        style={{
          visibility: value ? 'visible' : 'hidden',
        }}
        icon={<FormClose />}
        onClick={() => onClear()}
      />
    </Box>
  )
})
