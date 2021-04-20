/**
 *
 * TransitionRoute
 *
 */
import * as React from 'react'
import { Route, RouteComponentProps, useRouteMatch } from 'react-router-dom'

import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import { useRef } from 'react'

const Transition = styled.div`
  position: relative;
  transition: opacity 0.3s;

  // enter from
  &.fade-enter {
    opacity: 0;
  }

  // enter to
  &.fade-enter-active {
    opacity: 1;
  }

  // exit from
  &.fade-exit {
    opacity: 1;
  }

  // exit to 
  &.fade-exit-active {
    opacity: 0;
  }
}`

interface Props {
  exact?: boolean
  path: string
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
}

export function TransitionRoute(props: Props) {
  const fullPath = process.env.PUBLIC_URL + props.path
  const Component = props.component as any
  const nodeRef = useRef(null)
  let match = useRouteMatch(fullPath)

  return (
    <Route exact={props.exact} path={fullPath} key={props.path}>
      <CSSTransition
        in={match != null}
        timeout={300}
        classNames="fade"
        key={props.path}
        nodeRef={nodeRef}
        unmountOnExit
      >
        <Transition ref={nodeRef}>
          <Component />
        </Transition>
      </CSSTransition>
    </Route>
  )
}
