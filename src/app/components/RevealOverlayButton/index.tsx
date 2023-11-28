import { Button } from 'grommet/es6/components/Button'
import React, { useState } from 'react'
import { Box } from 'grommet/es6/components/Box'

interface Props {
  label: string
  children: React.ReactNode
}

export const RevealOverlayButton = (props: Props) => {
  const [hasRevealed, setHasRevealed] = useState(false)
  return (
    <Box style={{ position: 'relative' }}>
      <Button
        label={props.label}
        style={{
          visibility: hasRevealed ? 'hidden' : 'visible',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        onClick={() => setHasRevealed(true)}
      />
      <Box style={{ visibility: hasRevealed ? 'visible' : 'hidden' }}>{props.children}</Box>
    </Box>
  )
}
