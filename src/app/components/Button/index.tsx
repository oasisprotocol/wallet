/*
 * Used for time being until Wallet redesign is done
 */
import styled from 'styled-components'
import { Button, ButtonExtendedProps } from 'grommet/es6/components/Button'

const StyledButton = styled(Button)`
  font-size: 14px;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
`

interface BrandButtonProps extends ButtonExtendedProps {
  brandVariant?: 'brand-blue' | 'brand-gray-medium'
}

export function BrandButton(props: BrandButtonProps) {
  const { brandVariant = 'brand-blue', size = 'large', ...rest } = props
  return <StyledButton {...rest} primary color={brandVariant} size={size} />
}
