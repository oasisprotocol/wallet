import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Inbox } from 'grommet-icons/es6/icons/Inbox'
import { selectContactsList } from 'app/state/contacts/selectors'

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
    </Box>
  )
}
