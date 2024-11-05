import React from 'react'
import { RouteObject } from 'react-router-dom'
import { App } from 'app'
import { FromLedgerWebExtension } from 'app/pages/OpenWalletPage/webextension'
import { commonRoutes } from '../../../src/commonRoutes'
import { SelectOpenMethod } from '../../../src/app/pages/OpenWalletPage'

export const routes: RouteObject[] = [
  {
    path: '/*',
    element: <App />,
    children: [
      ...commonRoutes,
      {
        path: 'open-wallet',
        element: <SelectOpenMethod />,
      },
      {
        path: 'open-wallet/ledger',
        element: <FromLedgerWebExtension />,
      },
    ],
  },
]
