import { Box, Text } from 'grommet'
import * as React from 'react'
import { useHistory } from 'react-router'

interface DetailProps {
  icon?: React.ReactNode
  label: string
  value: string | React.ReactNode
  link?: string
}

export function InfoBox(props: DetailProps) {
  const history = useHistory()
  const boxClicked = () => {
    if (props.link) {
      history.push(props.link)
    }
  }

  return (
    <Box
      direction="row"
      gap="small"
      hoverIndicator={{ color: 'background-contrast' }}
      onClick={() => boxClicked()}
      pad="medium"
    >
      {props.icon && (
        <Box fill="vertical" align="center" justify="center" alignSelf="center" pad={{ right: 'xsmall' }}>
          {props.icon}
        </Box>
      )}
      <Box justify="center">
        <Text weight="bold">{props.label}</Text>
        <Text>{props.value}</Text>
      </Box>
    </Box>
  )
}
