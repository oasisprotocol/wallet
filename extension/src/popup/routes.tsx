import React from 'react'
import { RouteObject } from 'react-router-dom'
import { App } from 'app'
import { ConnectDevicePage } from 'app/pages/ConnectDevicePage'
import { OpenWalletPageWebExtension } from 'app/pages/OpenWalletPage/webextension'
import { commonRoutes } from '../../../src/commonRoutes'

export const routes: RouteObject[] = [
  {
    path: '/*',
    element: <App />,
    children: [
      ...commonRoutes,
      {
        path: 'open-wallet',
        element: <OpenWalletPageWebExtension />,
      },
    ],
  },
  {
    path: 'open-wallet/connect-device',
    element: <ConnectDevicePage />,
  },
]
