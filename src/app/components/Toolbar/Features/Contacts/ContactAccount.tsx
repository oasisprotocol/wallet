import { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Tabs } from 'grommet/es6/components/Tabs'
import { Tab } from 'grommet/es6/components/Tab'
import { contactsActions } from 'app/state/contacts'
import { Contact } from 'app/state/contacts/types'
import { Account } from '../Account/Account'
import { ResponsiveLayer } from '../../../ResponsiveLayer'
import { ContactAccountForm } from './ContactAccountForm'
import { layerOverlayMinHeight } from './layer'

interface ContactAccountProps {
  contact: Contact
}

export const ContactAccount = ({ contact }: ContactAccountProps) => {
  const { t } = useTranslation()
  const [layerVisibility, setLayerVisibility] = useState(false)
  const isMobile = useContext(ResponsiveContext) === 'small'
  const dispatch = useDispatch()
  const submitHandler = (contact: Contact) => dispatch(contactsActions.update(contact))
  const deleteHandler = (address: string) => dispatch(contactsActions.delete(address))

  return (
    <Box>
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
        <ResponsiveLayer
          onClickOutside={() => setLayerVisibility(false)}
          onEsc={() => setLayerVisibility(false)}
          animation="none"
          background="background-front"
          modal
          position="top"
          margin={isMobile ? 'none' : 'xlarge'}
        >
          <Box margin="medium" width={isMobile ? 'auto' : '700px'}>
            <Tabs alignControls="start">
              <Tab title={t('toolbar.contacts.manage', 'Manage Contact')}>
                <Box
                  flex="grow"
                  justify="center"
                  height={{ min: isMobile ? 'auto' : layerOverlayMinHeight }}
                  pad={{ vertical: 'medium' }}
                >
                  <ContactAccountForm
                    contact={contact}
                    deleteHandler={deleteHandler}
                    setLayerVisibility={setLayerVisibility}
                    submitHandler={submitHandler}
                  />
                </Box>
              </Tab>
            </Tabs>
          </Box>
        </ResponsiveLayer>
      )}
    </Box>
  )
}
