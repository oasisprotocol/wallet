import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveLayer } from '../../../ResponsiveLayer'

interface DeleteContactProps {
  deleteHandler: () => void
  setLayerVisibility: (isVisible: boolean) => void
}

export const DeleteContact = ({ deleteHandler, setLayerVisibility }: DeleteContactProps) => {
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <ResponsiveLayer
      onClickOutside={() => setLayerVisibility(false)}
      onEsc={() => setLayerVisibility(false)}
      animation="none"
      background="background-front"
      modal
      position="top"
      margin={isMobile ? 'none' : 'xlarge'}
    >
      <Box margin="medium">
        <Box flex="grow" justify="center">
          <Text weight="bold" size="medium" alignSelf="center" margin={{ bottom: 'large' }}>
            {t('toolbar.contacts.delete.title', 'Delete Contact')}
          </Text>
          <Text size="medium" alignSelf="center" margin={{ bottom: 'medium' }}>
            {t('toolbar.contacts.delete.description', 'Are you sure you want to delete this contact?')}
          </Text>
        </Box>
        <Box direction="row" align="center" justify="between" pad={{ top: 'medium' }}>
          <Button label={t('toolbar.contacts.cancel', 'Cancel')} onClick={() => setLayerVisibility(false)} />
          <Button
            onClick={deleteHandler}
            label={t('toolbar.contacts.delete.confirm', 'Yes, delete')}
            color="status-error"
            primary
          />
        </Box>
      </Box>
    </ResponsiveLayer>
  )
}
