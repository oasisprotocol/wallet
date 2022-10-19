import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Layer, Paragraph } from 'grommet'
import { useTranslation } from 'react-i18next'
import { Alert, Checkmark, Close, Configure } from 'grommet-icons'
import { ModalHeader } from 'app/components/Header'
import { AlertBox } from '../AlertBox'
import { selectAllowDangerousSetting } from '../SettingsDialog/slice/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { settingsActions } from '../SettingsDialog/slice'

interface Modal {
  title: string
  description: string
  handleConfirm: () => void

  /**
   * Is this a dangerous operation?
   *
   * If marked as such, it will only be possible to execute it if the wallet is configured to run in dangerous mode.
   *
   * It also automatically implies a mandatory waiting time of 10 sec, unless specified otherwise.
   */
  isDangerous: boolean

  /**
   * How long does the user have to wait before he can actually confirm the action?
   */
  mustWaitSecs?: number
}

interface ModalContainerProps {
  modal: Modal
  closeModal: () => void
  hideModal: () => void
}

interface ModalContextProps {
  /**
   * Show a new modal
   */
  launchModal: (modal: Modal) => void

  /**
   * Close the current modal
   */
  closeModal: () => void

  /**
   * Hide the current modal (with the intention of showing in again later)
   */
  hideModal: () => void

  /**
   * Show the previously hidden modal again
   */
  showModal: () => void
}

interface ModalProviderProps {
  children: React.ReactNode
}

const ModalContext = createContext<ModalContextProps>({} as ModalContextProps)

const ModalContainer = ({ modal, closeModal, hideModal }: ModalContainerProps) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const confirm = useCallback(() => {
    modal.handleConfirm()
    closeModal()
  }, [closeModal, modal])
  const { isDangerous, mustWaitSecs } = modal
  const allowDangerous = useSelector(selectAllowDangerousSetting)
  const forbidden = isDangerous && !allowDangerous
  const waitingTime = forbidden
    ? 0 // If the action is forbidden, there is nothing to wait for
    : isDangerous
    ? mustWaitSecs ?? 10 // For dangerous actions, we require 10 seconds of waiting, unless specified otherwise.
    : mustWaitSecs ?? 0 // For normal, non-dangerous operations, just use what was specified

  const [secsLeft, setSecsLeft] = useState(0)
  const openSettings = () => {
    hideModal()
    setTimeout(() => dispatch(settingsActions.setOpen(true)), 100)
  }

  useEffect(() => {
    if (waitingTime) {
      setSecsLeft(waitingTime)
      const stopCounting = () => window.clearInterval(interval)
      const interval = window.setInterval(
        () =>
          setSecsLeft(seconds => {
            const remains = seconds - 1
            if (!remains) stopCounting()
            return remains
          }),
        1000,
      )
      return stopCounting
    }
  }, [waitingTime])

  return (
    <Layer modal onEsc={closeModal} onClickOutside={closeModal} background="background-front">
      <Box margin="medium">
        <ModalHeader>{modal.title}</ModalHeader>
        <Paragraph fill>{modal.description}</Paragraph>
        {forbidden && (
          <AlertBox color={'status-error'}>
            {t(
              'dangerMode.youDontWantThis',
              "You most probably don't want to do this, so I won't allow it. If you really do, then please enable the 'dangerous mode' in wallet settings, and try again.",
            )}
          </AlertBox>
        )}
        {isDangerous && allowDangerous && (
          <AlertBox color={'status-warning'}>
            {t(
              'dangerMode.youCanButDoYouWant',
              "You most probably shouldn't do this, but since you have specifically enabled 'dangerous mode' in wallet settings, we won't stop you.",
            )}
          </AlertBox>
        )}
        <Box direction="row" gap="small" justify="between" pad={{ top: 'large' }}>
          <Button
            label={t('common.cancel', 'Cancel')}
            onClick={closeModal}
            secondary
            icon={<Close size="18px" />}
          />
          {!forbidden && (
            <Button
              label={t('common.confirm', 'Confirm') + (secsLeft ? ` (${secsLeft})` : '')}
              onClick={confirm}
              disabled={!!secsLeft}
              primary={modal.isDangerous}
              color={modal.isDangerous ? 'status-error' : ''}
              icon={modal.isDangerous ? <Alert size="18px" /> : <Checkmark size="18px" />}
            />
          )}
          {forbidden && (
            <Button label={t('menu.settings', 'Settings')} onClick={openSettings} icon={<Configure />} />
          )}
        </Box>
      </Box>
    </Layer>
  )
}

const ModalProvider = (props: ModalProviderProps) => {
  const [modal, setModal] = useState<Modal | null>(null)
  const [hiddenModal, setHiddenModal] = useState<Modal | null>(null)
  const closeModal = useCallback(() => {
    setModal(null)
  }, [])
  const hideModal = useCallback(() => {
    if (!modal) {
      throw new Error("You can't call hideModal if no model is shown!")
    }
    setHiddenModal(modal)
    setModal(null)
  }, [modal])
  const showModal = useCallback(() => {
    if (modal) {
      throw new Error("You can't call showModal when a modal is already visible!")
    }
    if (!hiddenModal) {
      return
    }
    setModal(hiddenModal)
    setHiddenModal(null)
  }, [modal, hiddenModal])

  return (
    <ModalContext.Provider value={{ closeModal, launchModal: setModal, hideModal, showModal }}>
      {props.children}
      {modal && <ModalContainer modal={modal} closeModal={closeModal} hideModal={hideModal} />}
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
