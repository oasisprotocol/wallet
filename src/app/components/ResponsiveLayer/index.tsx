import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { Layer, LayerExtendedProps } from 'grommet'
import { useCallback, useRef } from 'react'

function useRefWithCallback(onMount, onUnmount) {
  const nodeRef = useRef(null)

  const setRef = useCallback(
    node => {
      if (nodeRef.current) {
        onUnmount(nodeRef.current)
      }
      nodeRef.current = node
      if (nodeRef.current) {
        onMount(nodeRef.current)
      }
    },
    [onMount, onUnmount],
  )

  return setRef
}

/**
 * Wraps grommet's layer with body-scroll-lock
 * @param props Grommet Layer props
 */
export function ResponsiveLayer(props: LayerExtendedProps) {
  const layerRef = useRefWithCallback(
    node => disableBodyScroll(node),
    node => enableBodyScroll(node),
  )

  return <Layer {...props} ref={layerRef} />
}
