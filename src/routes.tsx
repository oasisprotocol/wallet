import React from 'react'
import { RouteObject } from 'react-router-dom'
import { App } from 'app'
import { OpenWalletPage } from 'app/pages/OpenWalletPage'
import { commonRoutes } from './commonRoutes'

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
    ],
  },
]
