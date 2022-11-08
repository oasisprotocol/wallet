import React from 'react'
import { App } from 'app'
import { commonRoutes, Route } from './commonRoutes'

export const routes: Route[] = [
  {
    path: '/*',
    element: <App />,
    children: [...commonRoutes],
  },
]
