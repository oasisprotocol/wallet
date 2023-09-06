import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Inbox } from 'grommet-icons/es6/icons/Inbox'
import { selectContactsList } from 'app/state/contacts/selectors'
import { AddContact } from './AddContact'

const ContactsListEmptyState = () => {
  const { t } = useTranslation()

  return (
    <Box gap="medium" align="center" pad={{ top: 'large' }}>
      <Inbox size="36px" color="currentColor" />
      <Box pad="large">{t('toolbar.contacts.emptyList', 'You have no contacts yet.')}</Box>
    </Box>
  )
}

export const Contacts = () => {
  const { t } = useTranslation()
  const [layerVisibility, setLayerVisibility] = useState(false)
  const contacts = useSelector(selectContactsList)

  return (
    <Box
      gap="small"
      pad={{ vertical: 'medium', right: 'small' }}
      overflow={{ vertical: 'auto' }}
      height="400px"
    >
      {!contacts.length && (
        <Box justify="center" flex="grow">
          <ContactsListEmptyState />
        </Box>
      )}
      <Box align="center">
        <Button
          primary
          label={t('toolbar.contacts.add', 'Add contact')}
          onClick={() => setLayerVisibility(true)}
        />
      </Box>
      {layerVisibility && <AddContact setLayerVisibility={setLayerVisibility} />}
    </Box>
  )
}
