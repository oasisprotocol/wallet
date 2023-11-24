import { Button } from 'grommet/es6/components/Button'
import { persistActions } from 'app/state/persist'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { DeleteInputForm } from '../../components/DeleteInputForm'
import { Box } from 'grommet/es6/components/Box'
import { Layer } from 'grommet/es6/components/Layer'
import { Header } from 'app/components/Header'

interface DeleteProfileButtonProps {
  prominent?: boolean
}

export function DeleteProfileButton({ prominent }: DeleteProfileButtonProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [layerVisibility, setLayerVisibility] = useState(false)

  const onCancel = () => {
    setLayerVisibility(false)
  }

  const onConfirm = () => {
    navigate('/')
    dispatch(persistActions.deleteProfileAsync())
  }

  return (
    <>
      <Button
        color={prominent ? 'status-error' : undefined}
        label={t('persist.loginToProfile.deleteProfile.button', 'Delete profile')}
        onClick={() => setLayerVisibility(true)}
        primary={prominent}
        plain={!prominent}
      />
      {layerVisibility && (
        <ModalLayout
          title={t('persist.loginToProfile.deleteProfile.title', 'Delete Profile')}
          onClickOutside={onCancel}
          onEsc={onCancel}
        >
          <DeleteInputForm onCancel={onCancel} onConfirm={onConfirm}>
            <Paragraph>
              <label htmlFor="type_delete">
                <Trans
                  t={t}
                  i18nKey="persist.loginToProfile.deleteProfile.description"
                  defaults="Are you sure you want to delete this profile? This action cannot be undone and will <strong>erase your private keys</strong>.<br/><br/>To continue please enter '{{confirmationKeyword}}' below."
                  values={{
                    confirmationKeyword: t('deleteForm.confirmationKeyword', 'delete'),
                  }}
                />
              </label>
            </Paragraph>
          </DeleteInputForm>
        </ModalLayout>
      )}
    </>
  )
}

export function ModalLayout(props: {
  title: string
  children: React.ReactNode
  onClickOutside?: () => void
  onEsc?: () => void
}) {
  return (
    <Layer modal background="background-front" onClickOutside={props.onClickOutside} onEsc={props.onEsc}>
      <Box pad="medium">
        <Header level={2} textAlign="center" margin={{ top: 'medium' }}>
          {props.title}
        </Header>

        {props.children}
      </Box>
    </Layer>
  )
}
