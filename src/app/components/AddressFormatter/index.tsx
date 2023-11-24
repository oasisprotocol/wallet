import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { normalizeColor } from 'grommet/es6/utils'
import { trimLongString } from '../ShortAddress/trimLongString'
import { selectContact } from 'app/state/contacts/selectors'

const StyledBox = styled(Box)`
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: ${({ theme }) => theme.global?.edgeSize?.xxsmall};
`

const StyledText = styled(Text)`
  padding-right: ${({ theme }) => theme.global?.edgeSize?.small};
  white-space: nowrap;
  font-weight: bold;
  color: ${({ theme }) => normalizeColor('grayMedium', theme)};
`

interface AddressFormatterProps {
  address: string
  /** Uses contacts if undefined */
  name?: string | undefined
}

export const AddressFormatter = (props: AddressFormatterProps) => {
  const contactAddress = useSelector(selectContact(props.address))
  const name = props.name || contactAddress?.name

  return (
    <StyledBox>
      {name && <StyledText data-testid="address-formatter-name">{name}</StyledText>}
      <Text>{trimLongString(props.address)}</Text>
    </StyledBox>
  )
}
