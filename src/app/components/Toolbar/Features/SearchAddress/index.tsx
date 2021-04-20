/**
 *
 * SearchAddress
 *
 */
import { isValidAddress } from 'app/lib/helpers'
import { Box, Button, Drop, Form, Text, TextInput } from 'grommet'
import { Alert, FormClose, Search } from 'grommet-icons/icons'
import React, { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

interface Props {}

export const SearchAddress = memo((props: Props) => {
  const { t } = useTranslation()
  const [searchPayload, setSearchPayload] = useState<string | undefined>('')
  const [invalidPayload, showInvalidPayload] = useState(false)

  const history = useHistory()
  const errorRef = useRef<any>()

  const updatePayload = (value: string) => {
    showInvalidPayload(false)
    setSearchPayload(value)
  }

  const goToAddress = () => {
    if (!searchPayload || !searchPayload.length) {
      return
    }

    const address = searchPayload.replaceAll(' ', '')
    if (isValidAddress(address)) {
      setSearchPayload('')
      history.push(`/account/${searchPayload.replaceAll(' ', '')}`)
    } else {
      showInvalidPayload(true)
    }
  }

  return (
    <Form onSubmit={() => goToAddress()}>
      <Box
        round="30px"
        border={{ size: '2px', color: 'light-4' }}
        fill="vertical"
        justify="center"
        align="center"
        width={{ max: '600px' }}
        direction="row"
        ref={errorRef}
      >
        <TextInput
          plain
          icon={<Search />}
          data-testid="searchaddress"
          value={searchPayload}
          onChange={e => {
            updatePayload(e.target.value)
          }}
          placeholder={
            <Text margin="36px" color="light-4">
              {t('toolbar.search.placeholder', 'Search for an account or a validator')}
            </Text>
          }
        />
        {searchPayload && <Button icon={<FormClose />} onClick={() => updatePayload('')} />}
      </Box>
      {errorRef.current && invalidPayload && (
        <Drop
          align={{ top: 'bottom', left: 'left' }}
          margin={{ top: '10px' }}
          target={errorRef.current}
          background="status-warning"
          round="5px"
        >
          <Box pad="small" direction="row" gap="small" round="5px">
            <Alert />
            <Text weight="bold">{t('errors.invalidAddress')}</Text>
          </Box>
        </Drop>
      )}
    </Form>
  )
})
