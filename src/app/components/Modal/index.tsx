import { createContext, useCallback, useContext, useState } from 'react'
import { Box, Button, Layer, Heading, Paragraph } from 'grommet'
import { useTranslation } from 'react-i18next'

interface Modal {
  title: string
  description: string
  handleConfirm: () => void
  isDangerous: boolean
}

interface ModalContainerProps {
  modal: Modal
  closeModal: () => void
}

interface ModalContextProps {
  launchModal: (modal: Modal) => void
  closeModal: () => void
}

interface ModalProviderProps {
  children: React.ReactNode
}

const ModalContext = createContext<ModalContextProps>({} as ModalContextProps)

const ModalContainer = ({ modal, closeModal }: ModalContainerProps) => {
  const { t } = useTranslation()
  const confirm = useCallback(() => {
    modal.handleConfirm()
    closeModal()
  }, [closeModal, modal])

  return (
    <Layer onEsc={closeModal} onClickOutside={closeModal} background="background-front">
      <Heading margin="medium" size="small">
        {modal.title}
      </Heading>
      <Paragraph margin="medium">{modal.description}</Paragraph>
      <Box justify="between" margin="medium" direction="row">
        <Button label={t('common.cancel')} onClick={closeModal} />
        <Button
          label={t('common.confirm')}
          disabled={modal.isDangerous}
          onClick={confirm}
          primary={modal.isDangerous}
          color={modal.isDangerous ? 'status-error' : ''}
        />
      </Box>
    </Layer>
  )
}

const ModalProvider = (props: ModalProviderProps) => {
  const [modal, setModal] = useState<Modal | null>(null)
  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  return (
    <ModalContext.Provider value={{ closeModal, launchModal: setModal }}>
      {props.children}
      {modal && <ModalContainer modal={modal} closeModal={closeModal} />}
    </ModalContext.Provider>
  )
}

const useModal = () => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }

  return context
}

export { ModalProvider, useModal }
