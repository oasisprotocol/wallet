import { useCallback } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Layer } from 'grommet/es6/components/Layer'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { useTranslation } from 'react-i18next'
import { Alert } from 'grommet-icons/es6/icons/Alert'
import { Checkmark } from 'grommet-icons/es6/icons/Checkmark'
import { Close } from 'grommet-icons/es6/icons/Close'
import { ModalHeader } from 'app/components/Header'

export interface Modal {
  title: string
  description: string
  handleConfirm: () => void
  isDangerous: boolean
}

interface ModalContainerProps {
  modal: Modal
  closeModal: () => void
}

export const ModalContainer = ({ modal, closeModal }: ModalContainerProps) => {
  const { t } = useTranslation()
  const confirm = useCallback(() => {
    modal.handleConfirm()
    closeModal()
  }, [closeModal, modal])

  return (
    <Layer modal onEsc={closeModal} onClickOutside={closeModal} background="background-front">
      <Box margin="medium">
        <ModalHeader>{modal.title}</ModalHeader>
        <Paragraph fill>{modal.description}</Paragraph>
        <Box direction="row" gap="small" justify="between" pad={{ top: 'large' }}>
          <Button
            label={t('common.cancel', 'Cancel')}
            onClick={closeModal}
            secondary
            icon={<Close size="18px" />}
          />
          <Button
            label={t('common.confirm', 'Confirm')}
            onClick={confirm}
            disabled={modal.isDangerous}
            primary={modal.isDangerous}
            color={modal.isDangerous ? 'status-error' : ''}
            icon={modal.isDangerous ? <Alert size="18px" /> : <Checkmark size="18px" />}
          />
        </Box>
      </Box>
    </Layer>
  )
}
