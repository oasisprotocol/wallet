import { createContext, useCallback, useContext, useState } from 'react'
import { Modal, ModalContainer } from './ModalContainer'

interface ModalContextProps {
  launchModal: (modal: Modal) => void
  closeModal: () => void
}

interface ModalProviderProps {
  children: React.ReactNode
}

const ModalContext = createContext<ModalContextProps>({} as ModalContextProps)

export const ModalProvider = (props: ModalProviderProps) => {
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

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }

  return context
}
