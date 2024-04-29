import React from 'react'
import { RouteObject } from 'react-router-dom'
import { App } from 'app'
import { OpenWalletPage } from 'app/pages/OpenWalletPage'
import { commonRoutes } from './commonRoutes'
import { FromLedger } from './app/pages/OpenWalletPage/Features/FromLedger'

export const routes: RouteObject[] = [
  {
    path: '/*',
    element: <App />,
    children: [
      ...commonRoutes,
      {
        path: 'open-wallet',
        element: <OpenWalletPage />,
      },
      {
        path: 'open-wallet/ledger',
        element: <FromLedger />,
      },
    ],
  },
]
