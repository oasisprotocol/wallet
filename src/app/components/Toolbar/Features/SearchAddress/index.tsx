/**
 *
 * SearchAddress
 *
 */
import { SearchBox } from 'app/components/Toolbar/Features/SearchAddress/SearchBox'
import { isValidAddress } from 'app/lib/helpers'
import { Box, Drop, Form, Text } from 'grommet'
import { Alert } from 'grommet-icons/icons'
import React, { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

interface Props {}

export const SearchAddress = memo((props: Props) => {
  const { t } = useTranslation()
  const [searchPayload, setSearchPayload] = useState<string>('')
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
      <SearchBox
        data-testid="searchaddress"
        ref={errorRef}
        value={searchPayload}
        onChange={value => updatePayload(value)}
        onClear={() => updatePayload('')}
        placeholder={t('toolbar.search.placeholder', 'Search for an address')}
      ></SearchBox>
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
