import React from 'react'
import { App } from 'app'
import { OpenWalletPage } from 'app/pages/OpenWalletPage'
import { commonRoutes, Route } from './commonRoutes'

export const routes: Route[] = [
  {
    path: '/*',
    element: <App />,
    children: [
      ...commonRoutes,
      {
        path: 'open-wallet',
        element: <OpenWalletPage />,
      },
    ],
  },
]
