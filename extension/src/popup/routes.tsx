import React from 'react'
import { App } from 'app'
import { ConnectDevicePage } from 'app/pages/ConnectDevicePage'
import { OpenWalletPageWebExtension } from 'app/pages/OpenWalletPage/webextension'
import { commonRoutes, Route } from '../../../src/commonRoutes'

export const routes: Route[] = [
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
