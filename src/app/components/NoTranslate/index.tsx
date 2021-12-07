import * as React from 'react'

interface Props {
  children: React.ReactNode
}

/**
 * Disable Google Translate on child element
 * https://cloud.google.com/translate/troubleshooting
 *
 * Main usage is to display generated mnemonic without modifications, and
 * without sending it to Google servers.
 */
export function NoTranslate(props: Props) {
  return (
    <span className="notranslate" translate="no">
      {props.children}
    </span>
  )
}
