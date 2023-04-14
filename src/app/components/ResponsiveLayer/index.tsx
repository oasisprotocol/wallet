import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { Layer, LayerExtendedProps } from 'grommet/es6/components/Layer'
import { RefCallback, useCallback, useRef } from 'react'

function useRefWithCallback<T>(onMount: (el: T) => void, onUnmount: (el: T) => void): RefCallback<T> {
  const nodeRef = useRef<T | null>(null)

  const setRef = useCallback(
    (node: T) => {
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
  const layerRef = useRefWithCallback<HTMLDivElement>(
    useCallback(node => disableBodyScroll(node), []),
    useCallback(node => enableBodyScroll(node), []),
  )

  return (
    <Layer {...props} ref={layerRef} style={{ overflowY: 'auto', ...props.style }}>
      <div>{props.children}</div>
    </Layer>
  )
}
