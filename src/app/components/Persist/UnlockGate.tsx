import { selectHasV0StorageToMigrate, selectNeedsPassword } from 'app/state/persist/selectors'
import React from 'react'
import { useSelector } from 'react-redux'
import { UnlockForm } from 'app/components/Persist/UnlockForm'
import { MigrateV0StateForm } from 'app/components/Persist/MigrateV0StateForm'

interface Props {
  children: React.ReactNode
}

/**
 * Ask for password if user has encrypted state in localStorage, and no password in state.
 * Otherwise show child element.
 */
export function UnlockGate(props: Props) {
  const needsPassword = useSelector(selectNeedsPassword)
  const hasV0StorageToMigrate = useSelector(selectHasV0StorageToMigrate)
  if (needsPassword || location.hash === '#locked' || location.hash === '#delete') {
    return <UnlockForm />
  }
  if (hasV0StorageToMigrate || location.hash === '#migrate') {
    return <MigrateV0StateForm />
  }
  return <>{props.children}</>
}
