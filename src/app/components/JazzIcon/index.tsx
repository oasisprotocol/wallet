import React, { memo, useEffect, useRef } from 'react'
import jazzicon from '@metamask/jazzicon'
import { Box } from 'grommet/es6/components/Box'

interface JazzIconProps {
  diameter: number
  seed: number
}

export const JazzIcon = memo(({ diameter, seed }: JazzIconProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref?.current) {
      const icon = jazzicon(diameter, seed)

      ref.current.replaceChildren(icon)
    }
  }, [diameter, ref, seed])

  return <Box ref={ref}></Box>
})
