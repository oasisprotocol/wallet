import React, { FC, PropsWithChildren, useContext } from 'react'
import { IonicContext } from '../../providers/IonicContext'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { navigateToAppStore } from '../../utils/capacitor-app-update'
import { Paragraph } from 'grommet/es6/components/Paragraph'

export const UpdateGate: FC<PropsWithChildren> = ({ children }) => {
  const {
    state: { requiresUpdate },
  } = useContext(IonicContext)

  if (requiresUpdate === false) return children

  const handleNavigateToAppStore = () => {
    navigateToAppStore()
  }

  return (
    <Box direction="row-responsive" background="background-back" fill style={{ minHeight: '100dvh' }}>
      {requiresUpdate === undefined && (
        <Paragraph size="small" fill textAlign="center">
          Loading...
        </Paragraph>
      )}
      {requiresUpdate === true && (
        <Box direction="column" gap="small" alignContent="center">
          <Paragraph size="small" fill textAlign="center">
            This app requires an update to the latest version in order to operate correctly.
          </Paragraph>
          <Button fill="horizontal" label="Update application" onClick={handleNavigateToAppStore} />
        </Box>
      )}
    </Box>
  )
}
