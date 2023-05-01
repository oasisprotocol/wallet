import { Box } from 'grommet/es6/components/Box'
import { ButtonLink } from 'app/components/ButtonLink'
import { useTranslation } from 'react-i18next'
import { Header } from 'app/components/Header'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { useDispatch, useSelector } from 'react-redux'
import { selectAddress } from 'app/state/wallet/selectors'
import { AlertBox } from 'app/components/AlertBox'
import { CircleAlert } from 'grommet-icons/es6/icons/CircleAlert'
import { selectSelectedNetwork } from '../../state/network/selectors'
import { selectAccountIsLoading } from '../../state/account/selectors'
import { Button } from 'grommet/es6/components/Button'
import { networkActions } from '../../state/network'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { useState } from 'react'

function Layout(props: { children?: React.ReactNode }) {
  const { t } = useTranslation()
  return (
    <Box
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
      background="background-front"
      pad="medium"
    >
      <Header>{t('fiatOnramp.header', 'Buy crypto to your wallet')}</Header>
      <p>
        {t(
          'fiatOnramp.description',
          'This feature allows you to convert your fiat currency into cryptocurrency.',
        )}
      </p>

      <Box align="start" gap="medium">
        {props.children}
      </Box>
    </Box>
  )
}

export function FiatOnramp() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedNetwork = useSelector(selectSelectedNetwork)
  const accountIsLoading = useSelector(selectAccountIsLoading)
  const isAddressInWallet = useSelector(selectIsAddressInWallet)
  const walletAddress = useSelector(selectAddress)
  const [thirdPartyAcknowledged, setThirdPartyAcknowledged] = useState(false)

  if (selectedNetwork !== 'mainnet') {
    return (
      <Layout>
        <AlertBox color="status-error">
          <Box direction="row" gap="small" align="center">
            <CircleAlert size="24px" color="status-error" />
            {t('fiatOnramp.notMainnet', 'You can only use this feature when your are on the mainnet.')}
          </Box>
        </AlertBox>

        <Button
          onClick={() => dispatch(networkActions.selectNetwork('mainnet'))}
          label={t('fiatOnramp.switchToMainnet', 'Switch to Mainnet')}
          primary
        />
      </Layout>
    )
  }
  if (accountIsLoading) {
    return <Layout />
  }
  if (!walletAddress || !isAddressInWallet) {
    return (
      <Layout>
        <AlertBox color="status-error">
          <Box direction="row" gap="small" align="center">
            <CircleAlert size="24px" color="status-error" />
            {t('fiatOnramp.notYourAccount', 'You can only use this feature when your wallet is open.')}
          </Box>
        </AlertBox>
        <ButtonLink to="/" label={t('fiatOnramp.openYourWallet', 'Open your wallet')} primary />
      </Layout>
    )
  }

  return (
    <Layout>
      <AlertBox color="status-error">
        <Box direction="row" gap="small" align="center">
          <CircleAlert size="24px" color="status-error" />
          {t(
            'fiatOnramp.thirdPartyDisclaimer',
            'This service is provided by an external party. Oasis does not carry any responsibility.',
          )}
        </Box>
      </AlertBox>

      {!thirdPartyAcknowledged ? (
        <Box style={{ height: 825 }}>
          <CheckBox
            label={t(
              'fiatOnramp.thirdPartyAcknowledge',
              'I understand that I’m using a third-party solution and Oasis does not carry any responsibility over the usage of this solution.',
            )}
            checked={thirdPartyAcknowledged}
            onChange={event => setThirdPartyAcknowledged(event.target.checked)}
          />
        </Box>
      ) : (
        <iframe
          height="825"
          title="Transak On/Off Ramp Widget"
          allow="camera;microphone;fullscreen;payment"
          // TODO: maybe restrict top-navigation with sandbox=""
          src={`${process.env.REACT_APP_TRANSAK_URL}/?${new URLSearchParams({
            apiKey: process.env.REACT_APP_TRANSAK_PARTNER_ID,
            productsAvailed: 'BUY',
            cryptoCurrencyCode: 'ROSE',
            walletAddress: walletAddress,
            disableWalletAddressForm: 'true',

            themeColor: '#18213c',
          }).toString()}`}
          style={{
            display: 'block',
            width: '100%',
            maxHeight: '825px',
            maxWidth: '500px',
            borderRadius: '3px',
            border: 'none',
          }}
        ></iframe>
      )}
    </Layout>
  )
}
