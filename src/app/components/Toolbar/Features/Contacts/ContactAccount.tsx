import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Tabs } from 'grommet/es6/components/Tabs'
import { Tab } from 'grommet/es6/components/Tab'
import { contactsActions } from 'app/state/contacts'
import { Contact } from 'app/state/contacts/types'
import { Account } from '../Account/Account'
import { ContactAccountForm } from './ContactAccountForm'
import { LayerContainer } from '../LayerContainer'

interface ContactAccountProps {
  contact: Contact
}

export const ContactAccount = ({ contact }: ContactAccountProps) => {
  const { t } = useTranslation()
  const [layerVisibility, setLayerVisibility] = useState(false)
  const dispatch = useDispatch()
  const submitHandler = (contact: Contact) => dispatch(contactsActions.update(contact))
  const deleteHandler = (address: string) => dispatch(contactsActions.delete(address))

  return (
    <>
      <Account
        address={contact.address}
        balance={undefined}
        displayBalance={false}
        displayManageButton={{
          onClickManage: () => setLayerVisibility(true),
        }}
        isActive={false}
        key={contact.address}
        name={contact.name}
        onClick={() => setLayerVisibility(true)}
      />
      {layerVisibility && (
        <LayerContainer hideLayer={() => setLayerVisibility(false)}>
          <Tabs>
            <Tab title={t('toolbar.contacts.manage', 'Manage Contact')}>
              <Box flex="grow" justify="center">
                <ContactAccountForm
                  contact={contact}
                  onDelete={address => {
                    deleteHandler(address)
                    setLayerVisibility(false)
                  }}
                  onCancel={() => setLayerVisibility(false)}
                  onSave={contract => {
                    submitHandler(contract)
                    setLayerVisibility(false)
                  }}
                />
              </Box>
            </Tab>
          </Tabs>
        </LayerContainer>
      )}
    </>
  )
}
