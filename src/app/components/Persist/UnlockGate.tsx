import { selectNeedsPassword } from 'app/state/persist/selectors'
import React from 'react'
import { useSelector } from 'react-redux'
import { UnlockForm } from 'app/components/Persist/UnlockForm'

interface Props {
  children: React.ReactNode
}

/**
 * Ask for password if user has encrypted state in localStorage, and no password in state.
 * Otherwise show child element.
 */
export function UnlockGate(props: Props) {
  const needsPassword = useSelector(selectNeedsPassword)
  if (needsPassword) {
    return <UnlockForm />
  }
  return <>{props.children}</>
}
