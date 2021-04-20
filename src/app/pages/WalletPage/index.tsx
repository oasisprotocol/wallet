import { Grid } from 'grommet'
import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { selectStatus } from './slice/selectors'

export function WalletPage() {
  const walletIsOpen = useSelector(selectStatus)
  const history = useHistory()

  if (!walletIsOpen) {
    history.push('/')
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A React Boilerplate application homepage" />
      </Helmet>
      <Grid gap="small" pad="small" columns={['3fr', '2fr']}></Grid>
    </>
  )
}
