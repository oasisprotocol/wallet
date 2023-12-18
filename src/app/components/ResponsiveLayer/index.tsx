import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { Layer, LayerExtendedProps } from 'grommet/es6/components/Layer'
import { RefCallback, useCallback, useContext, useRef } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'

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
  const isMobile = useContext(ResponsiveContext) === 'small'
  const layerRef = useRefWithCallback<HTMLDivElement>(
    useCallback(node => disableBodyScroll(node), []),
    useCallback(node => enableBodyScroll(node), []),
  )

  return (
    <Layer
      {...props}
      ref={layerRef}
      className="fix-responsive-layer"
      style={{ overflowY: 'auto', ...props.style }}
    >
      <Box
        // Prevents Grommet flex overlap issue in smaller viewport
        flex={{ shrink: 0, grow: 1 }}
        style={{
          minHeight: isMobile ? '100dvh' : 'auto',
        }}
      >
        {props.children}
      </Box>
    </Layer>
  )
}
