import { wordlists } from 'bip39'
import { Box, Button, Grid, Heading, Layer, ResponsiveContext, Text } from 'grommet'
import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MnemonicGrid } from '../MnemonicGrid'

interface Props {
  validMnemonic: string[]

  /** Called once the mnemonic is confirmed */
  successHandler: () => void
  abortHandler: () => void
}

export function MnemonicValidation({ validMnemonic, successHandler, abortHandler }: Props) {
  const numberOfSteps = 5
  const numberOfWrongWords = 5

  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)

  const [indexes, setIndexes] = useState<number[]>([])
  const [choices, setChoices] = useState<string[]>([])

  const currentStep = numberOfSteps - indexes.length + 1

  useEffect(() => {
    // Pick 5 random indexes
    const randomIndexes = randIndexes(validMnemonic, numberOfSteps).sort((a, b) => a - b)
    setIndexes(randomIndexes)
  }, [validMnemonic])

  useEffect(() => {
    // Pick random words from the wordlist with the valid word
    const choicesId = randIndexes(wordlists.english, numberOfWrongWords)
    const currentIndex = indexes[0]
    const validWord = validMnemonic[currentIndex]
    setChoices(shuffle([...choicesId.map(c => wordlists.english[c]), validWord]))
  }, [indexes, validMnemonic])

  const wordClicked = (word: string) => {
    const currentIndex = indexes[0]
    const valid = validMnemonic[currentIndex] === word
    const isLastWord = indexes.length === 1

    if (isLastWord && valid) {
      successHandler()
    } else if (valid) {
      // Move to the next one
      const newArr = indexes.slice()
      newArr.shift()

      setIndexes(newArr)
    } else {
      // Restart the process
      const randomIndexes = randIndexes(validMnemonic, numberOfSteps).sort((a, b) => a - b)
      setIndexes(randomIndexes)
    }
  }

  return (
    <Layer plain full data-testid="mnemonic-validation">
      <Box fill style={{ backdropFilter: 'blur(5px)' }}>
        <Layer background="background-front" onClickOutside={abortHandler}>
          <Box background="background-front" pad="medium" gap="small" overflow="auto">
            <Heading size="4" margin="none">
              {t('createWallet.confirmMnemonic.header', 'Confirm your mnemonic ({{progress}}/{{total}})', {
                progress: currentStep,
                total: numberOfSteps,
              })}
            </Heading>
            <MnemonicGrid mnemonic={validMnemonic} hiddenWords={indexes} highlightedIndex={indexes[0]} />
            <Text data-testid="pick-word">
              {t(
                'createWallet.confirmMnemonic.pickWord',
                'Pick the right word corresponding to word #{{index}}',
                { index: indexes[0] + 1 },
              )}
            </Text>
            <Grid columns={size !== 'small' ? 'small' : '100%'} gap="small">
              {choices.map(w => (
                <Button
                  label={w}
                  style={{ borderRadius: '4px' }}
                  onClick={() => wordClicked(w)}
                  key={`${currentStep}-${w}`}
                />
              ))}
            </Grid>
            <Box align="end" pad={{ top: 'medium' }}>
              <Button
                primary
                style={{ borderRadius: '4px' }}
                label={t('common.cancel', 'Cancel')}
                onClick={abortHandler}
              />
            </Box>
          </Box>
        </Layer>
      </Box>
    </Layer>
  )
}

function randIndexes<T>(array: T[], num: number = 1): number[] {
  const keys = Object.keys(array)

  // shuffle the array of keys
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)) // 0 ≤ j ≤ i
    const tmp = keys[j]
    keys[j] = keys[i]
    keys[i] = tmp
  }
  return keys.slice(0, num).map(i => Number(i))
}

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    temporaryValue: T,
    randomIndex: number

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
