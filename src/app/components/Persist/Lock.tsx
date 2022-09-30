import { persistActions } from 'app/state/persist'
import { selectHasPersistedProfiles } from 'app/state/persist/selectors'
import { Box, Button } from 'grommet'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export function Lock() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const hasPersistedProfiles = useSelector(selectHasPersistedProfiles)

  if (!hasPersistedProfiles) {
    return <></>
  }

  return (
    <Box direction="row" gap="small">
      <Button label="Lock profile" onClick={() => dispatch(persistActions.lockAsync())}></Button>

      <Button
        label="Erase profile"
        onClick={() => {
          navigate('/')
          dispatch(persistActions.eraseAsync())
        }}
      ></Button>
    </Box>
  )
}
