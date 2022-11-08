import React from 'react'
import { App } from 'app'
import { commonRoutes, Route } from '../../../src/commonRoutes'

export const routes: Route[] = [
  {
    path: '/*',
    element: <App />,
    children: [...commonRoutes],
  },
]
