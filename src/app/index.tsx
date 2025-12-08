/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import { PrivacyScreen } from '@capacitor/privacy-screen'
import { Box } from 'grommet/es6/components/Box'
import { Main } from 'grommet/es6/components/Main'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import * as React from 'react'
import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { FatalErrorHandler } from './components/FatalErrorHandler'
import { PageFooter } from './components/Footer/PageFooter'
import { Navigation } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
import { ModalProvider } from './components/Modal'
import { useRouteRedirects } from './useRouteRedirects'
import { PersistLoadingGate } from 'app/components/Persist/PersistLoadingGate'
import { UnlockGate } from 'app/components/Persist/UnlockGate'
import { BuildBanner } from 'app/components/BuildBanner'
import { IonicNativePlatformProvider } from './components/Ionic/components/IonicNativePlatformProvider'
import { selectScreenPrivacy } from 'app/state/settings/slice/selectors'
import { runtimeIs } from 'app/lib/runtimeIs'

export function App() {
  useRouteRedirects()
  const { i18n } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'
  const screenPrivacy = useSelector(selectScreenPrivacy)

  useEffect(() => {
    if (runtimeIs !== 'mobile-app') {
      return
    }

    const initializePrivacyScreen = async () => {
      try {
        if (screenPrivacy === 'on') {
          await PrivacyScreen.enable({
            android: {
              preventScreenshots: true,
              dimBackground: true,
              privacyModeOnActivityHidden: 'dim',
            },
            ios: { blurEffect: 'dark' },
          })
        } else {
          await PrivacyScreen.disable()
        }
      } catch (error) {
        console.error('Failed to initialize PrivacyScreen on app init:', error)
      }
    }

    initializePrivacyScreen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FatalErrorHandler>
      <IonicNativePlatformProvider>
        <ModalProvider>
          <Helmet
            titleTemplate="%s - ROSE Wallet"
            defaultTitle="ROSE Wallet"
            htmlAttributes={{ lang: i18n.language }}
          >
            <meta name="description" content="A wallet for Oasis" />
          </Helmet>
          {!isMobile && <BuildBanner />}
          <Box direction="row-responsive" background="background-back" fill style={{ minHeight: '100dvh' }}>
            <PersistLoadingGate>
              <UnlockGate>
                <Navigation />
                <Box flex pad={{ top: isMobile ? '64px' : undefined }}>
                  <Main>
                    {isMobile && <BuildBanner />}
                    <Toolbar />
                    <Outlet />
                    <PageFooter />
                  </Main>
                </Box>
              </UnlockGate>
            </PersistLoadingGate>
          </Box>
        </ModalProvider>
      </IonicNativePlatformProvider>
    </FatalErrorHandler>
  )
}
