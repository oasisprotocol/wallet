import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Text } from 'grommet/es6/components/Text'
import { ScrollableLayer } from '../../../ScrollableLayer'
import { DeleteInputForm } from '../../../../components/DeleteInputForm'
import { Account } from '../Account/Account'
import { Wallet } from '../../../../state/wallet/types'

interface DeleteAccountProps {
  onDelete: () => void
  onCancel: () => void
  wallet: Wallet
}

export const DeleteAccount = ({ onCancel, onDelete, wallet }: DeleteAccountProps) => {
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <ScrollableLayer
      onClickOutside={onCancel}
      onEsc={onCancel}
      animation="none"
      background="background-front"
      modal
      margin={isMobile ? 'none' : 'xlarge'}
    >
      <Box margin="medium">
        <Box flex="grow" justify="center">
          <Text weight="bold" size="medium" textAlign="center" margin={{ bottom: 'large' }}>
            {t('toolbar.settings.delete.title', 'Delete Account')}
          </Text>
          <Text size="medium" textAlign="center" margin={{ bottom: 'medium' }}>
            {t(
              'toolbar.settings.delete.description',
              'Are you sure you want to delete the following account?',
            )}
          </Text>
          <Account
            address={wallet.address}
            balance={undefined}
            displayBalance={false}
            isActive
            name={wallet.name}
          />

          <DeleteInputForm onCancel={onCancel} onConfirm={onDelete}>
            <label htmlFor="type_delete">
              <Paragraph fill textAlign="center">
                <Trans
                  i18nKey="toolbar.settings.delete.inputHelp"
                  t={t}
                  defaults="This action cannot be undone. To continue please type <strong>{{confirmationKeyword}}</strong> below."
                  values={{
                    confirmationKeyword: t('deleteForm.confirmationKeyword', 'delete'),
                  }}
                />
              </Paragraph>
            </label>
          </DeleteInputForm>
        </Box>
      </Box>
    </ScrollableLayer>
  )
}
