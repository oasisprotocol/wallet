import { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Text } from 'grommet/es6/components/Text'
import { User } from 'grommet-icons/es6/icons/User'
import { selectUnlockedStatus } from 'app/state/selectUnlockedStatus'
import { UpdatePassword } from './UpdatePassword'
import { DeleteProfileButton } from '../../../Persist/DeleteProfileButton'
import { Lock } from 'grommet-icons/es6/icons/Lock'
import { Logout } from 'grommet-icons/es6/icons/Logout'
import { selectIsLockableOrCloseable } from 'app/state/selectIsLockableOrCloseable'
import { persistActions } from 'app/state/persist'

type ProfileEmptyStateProps = {
  children: ReactNode
}

const ProfileEmptyState = ({ children }: ProfileEmptyStateProps) => (
  <Box gap="medium" align="center" pad={{ top: 'large' }}>
    <User size="36px" color="currentColor" />
    <Box pad="large">{children}</Box>
  </Box>
)

interface ProfileProps {
  closeHandler: () => any
}

export const Profile = ({ closeHandler }: ProfileProps) => {
  const { t } = useTranslation()
  const unlockedStatus = useSelector(selectUnlockedStatus)
  const isProfileAvailable = unlockedStatus === 'unlockedProfile'
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLockableOrCloseable = useSelector(selectIsLockableOrCloseable)
  const closeWallet = () => {
    navigate('/')
    dispatch(persistActions.lockAsync())
  }
  const lockProfile = () => {
    dispatch(persistActions.lockAsync())
  }

  return (
    <>
      <Box flex="grow">
        {!isProfileAvailable && (
          <ProfileEmptyState>
            <Box style={{ display: 'block' }}>
              <Trans
                i18nKey="toolbar.profile.notAvailable"
                t={t}
                components={{
                  OpenWalletButton: (
                    <Button
                      color="link"
                      onClick={() => {
                        closeHandler()
                        navigate('/open-wallet')
                      }}
                    />
                  ),
                }}
                defaults="You can setup your profile while <OpenWalletButton>opening a wallet</OpenWalletButton>."
              />
            </Box>
          </ProfileEmptyState>
        )}

        {isProfileAvailable && (
          <>
            <UpdatePassword />
            <Box gap="small" margin={{ top: 'medium' }} alignSelf="start">
              <Text>{t('toolbar.profile.deletion', 'Deletion')}</Text>
              <DeleteProfileButton prominent variant="voluntary" />
            </Box>
          </>
        )}
      </Box>
      <Box align="end" margin={{ top: 'large' }}>
        {isLockableOrCloseable === 'closeable' && (
          <Button
            data-testid="profile-modal-close-wallet"
            icon={<Logout />}
            label={t('menu.closeWallet', 'Close wallet')}
            onClick={() => closeWallet()}
          />
        )}
        {isLockableOrCloseable === 'lockable' && (
          <Button
            data-testid="profile-modal-lock-wallet"
            icon={<Lock />}
            label={t('menu.lockProfile', 'Lock profile')}
            onClick={() => lockProfile()}
          />
        )}
      </Box>
    </>
  )
}
