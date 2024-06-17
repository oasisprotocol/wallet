import * as React from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { ErrorPayload, WalletError, WalletErrors } from 'types/errors'
import { Box } from 'grommet/es6/components/Box'
import { AlertBox } from 'app/components/AlertBox'
import { ErrorFormatter } from 'app/components/ErrorFormatter'

export function ErrorBoundary() {
  const error = useRouteError()

  let errorPayload: ErrorPayload
  if (isRouteErrorResponse(error)) {
    errorPayload = { code: WalletErrors.UnknownError, message: error.statusText }
  } else if (error instanceof WalletError) {
    errorPayload = { code: error.type, message: error.message }
  } else if (error instanceof Error) {
    errorPayload = { code: WalletErrors.UnknownError, message: error.message }
  } else {
    errorPayload = { code: WalletErrors.UnknownError, message: error as string }
  }

  return (
    <Box pad={'small'}>
      <AlertBox
        status="error"
        content={<ErrorFormatter code={errorPayload.code} message={errorPayload.message} />}
      />
    </Box>
  )
}
