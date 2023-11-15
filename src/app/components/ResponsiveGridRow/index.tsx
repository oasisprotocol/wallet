import { useSelector } from 'react-redux'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import React, { memo, useContext } from 'react'
import { selectContact } from 'app/state/contacts/selectors'
import { PrettyAddress } from '../PrettyAddress'

interface ResponsiveGridRowProps {
  label: React.ReactNode
  value: React.ReactNode
}

export const ResponsiveGridRow = memo(({ label, value }: ResponsiveGridRowProps) => {
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <>
      <Box>
        <Text weight="bold" size={isMobile ? 'small' : 'medium'}>
          {label}
        </Text>
      </Box>
      <Box margin={{ bottom: 'small' }} direction="row">
        <Text size={isMobile ? 'small' : 'medium'}>{value}</Text>
      </Box>
    </>
  )
})

export const PreviewRow = ({ label, value }: ResponsiveGridRowProps) => (
  <Box>
    <Text weight="bold" size="small">
      {label}
    </Text>
    <Text color="grayMedium" size="small">
      {value}
    </Text>
  </Box>
)

interface AddressPreviewRowProps {
  label: string
  value: string
}

export const AddressPreviewRow = ({ label, value }: AddressPreviewRowProps) => {
  const contactAddress = useSelector(selectContact(value))
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <PreviewRow
      label={label}
      value={
        <Box direction={isMobile ? 'column' : 'row'} gap={isMobile ? 'none' : 'small'}>
          {contactAddress && (
            <Text color="text" size="small" weight="bold">
              {contactAddress.name}
            </Text>
          )}
          <PrettyAddress address={value} />
        </Box>
      }
    />
  )
}
