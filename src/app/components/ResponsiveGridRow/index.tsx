import { useSelector } from 'react-redux'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import React, { memo } from 'react'
import { selectContact } from 'app/state/contacts/selectors'
import { PrettyAddress } from '../PrettyAddress'

interface ResponsiveGridRowProps {
  label: React.ReactNode
  value: React.ReactNode
}

export const ResponsiveGridRow = memo(({ label, value }: ResponsiveGridRowProps) => {
  return (
    <>
      <Box>
        <Text weight="bold">{label}</Text>
      </Box>
      <Box direction="row">{value}</Box>
    </>
  )
})

interface ResponsiveGridAddressRowProps {
  label: string
  value: string
}

export const ResponsiveGridAddressRow = ({ label, value }: ResponsiveGridAddressRowProps) => {
  const contactAddress = useSelector(selectContact(value))

  return (
    <>
      {contactAddress && (
        <ResponsiveGridRow label={label} value={<Text weight="bold">{contactAddress.name}</Text>} />
      )}
      <ResponsiveGridRow label={contactAddress ? '' : label} value={<PrettyAddress address={value} />} />
    </>
  )
}
