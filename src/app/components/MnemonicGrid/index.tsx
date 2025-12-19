import { NoTranslate } from 'app/components/NoTranslate'
import { Box } from 'grommet/es6/components/Box'
import { Grid } from 'grommet/es6/components/Grid'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import * as React from 'react'
import { useContext } from 'react'
import { getDefaultWordlist, wordlists } from 'bip39'
import { runtimeIs } from 'app/lib/runtimeIs'

const validWords = new Set(wordlists[getDefaultWordlist()])

/**
 *
 * MnemonicGrid
 *
 */
interface WordProp {
  id: number
  word: string
}

const noSelect: React.CSSProperties = {
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
}

function MnemonicWord(props: WordProp) {
  const isWordValid = validWords.has(props.word)

  return (
    <Box
      background="background-contrast"
      margin="xsmall"
      direction="row"
      pad="xsmall"
      border={{ side: 'bottom' }}
    >
      <Box pad={{ right: 'small' }}>
        <Text style={{ ...noSelect, fontSize: runtimeIs === 'mobile-app' ? '14px' : '16px' }}>
          {props.id}.
        </Text>
      </Box>
      <Box>
        <NoTranslate>
          <strong
            style={{
              whiteSpace: 'pre',
              textDecoration: isWordValid ? undefined : 'red wavy underline',
              fontSize: runtimeIs === 'mobile-app' ? '14px' : '16px',
            }}
          >
            {props.word}
          </strong>
        </NoTranslate>
      </Box>
    </Box>
  )
}

interface Props {
  // List of words
  mnemonic: string[]
}

export function MnemonicGrid({ mnemonic }: Props) {
  const size = useContext(ResponsiveContext)
  const maxEnglishLength = 8
  const numberDotSpaceLength = 4
  const columnSize =
    size === 'large'
      ? ['1fr', '1fr', '1fr', '1fr']
      : runtimeIs === 'mobile-app' && size === 'small'
      ? ['1fr', '1fr', '1fr']
      : `${maxEnglishLength + numberDotSpaceLength + 2}ch`

  return (
    <NoTranslate>
      <Grid columns={columnSize} data-testid="mnemonic-grid">
        {mnemonic.map((word, index) => (
          <MnemonicWord key={index + 1} id={index + 1} word={word} />
        ))}
      </Grid>
    </NoTranslate>
  )
}
