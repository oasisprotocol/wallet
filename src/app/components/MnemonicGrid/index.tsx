import { Box, Grid, ResponsiveContext, Text } from 'grommet'
import * as React from 'react'
import { useContext } from 'react'

/**
 *
 * MnemonicGrid
 *
 */
interface WordProp {
  id: number
  word: string
}

let noSelect: React.CSSProperties = {
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
}

function MnemonicWord(props: WordProp) {
  return (
    <Box background="light-1" margin="xsmall" direction="row" pad="xsmall">
      <Box pad={{ right: 'small' }}>
        <Text style={noSelect}>{props.id}.</Text>
      </Box>
      <Box>
        <strong>{props.word}</strong>
      </Box>
    </Box>
  )
}

interface Props {
  mnemonic: string
}

export function MnemonicGrid({ mnemonic }: Props) {
  const size = useContext(ResponsiveContext)
  const columns = {
    small: ['1fr', '1fr'],
    medium: ['1fr', '1fr', '1fr'],
    large: ['1fr', '1fr', '1fr', '1fr'],
  }

  const words = mnemonic!
    .split(' ')
    .map(word => word.trim())
    .filter(word => word !== '')

  return (
    <Grid columns={columns[size]}>
      {words.map((word, index) => (
        <MnemonicWord key={index + 1} id={index + 1} word={word}></MnemonicWord>
      ))}
    </Grid>
  )
}
