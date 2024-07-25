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
import { selectThirdPartyAcknowledged } from './slice/selectors'
import { fiatOnrampActions } from './slice'
import { useState } from 'react'
import { ShareRounded } from 'grommet-icons/es6/icons/ShareRounded'
import { Paragraph } from 'grommet/es6/components/Paragraph'

function Layout(props: { children?: React.ReactNode }) {
  const { t } = useTranslation()
  return (
    <Box
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
      background="background-front"
      pad="medium"
      alignSelf="center"
      width={{ max: '651px' }} // Padding + Transak threshold for >mobile layout
    >
      <Header level="2">{t('fiatOnramp.header', 'Buy ROSE')}</Header>

      <Paragraph size="small" fill margin={{ top: '0px' }}>
        {t('fiatOnramp.description', 'Convert your fiat currency into crypto.')}{' '}
        {t(
          'fiatOnramp.thirdPartyDisclaimer',
          'This service is provided by Transak - an external party. Oasis* does not carry any responsibility. All fees charged by Transak.',
        )}
      </Paragraph>

      {props.children}
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
  const thirdPartyAcknowledged = useSelector(selectThirdPartyAcknowledged)
  // Intentionally not responsive. If it initializes with embedded iframe, user
  // inputs some data, then resizes: do not lose user's inputs!
  const [shouldOpenTransakInNewTab] = useState(window.innerWidth <= 768 || window.innerHeight <= 700)

  if (selectedNetwork !== 'mainnet') {
    return (
      <Layout>
        <Box align="start" gap="medium">
          <AlertBox status="error" icon={<CircleAlert size="24px" />}>
            {t('fiatOnramp.notMainnet', 'You can only use this feature when you are on the mainnet.')}
          </AlertBox>

          <Button
            onClick={() => dispatch(networkActions.selectNetwork('mainnet'))}
            label={t('fiatOnramp.switchToMainnet', 'Switch to Mainnet')}
            primary
          />
        </Box>
      </Layout>
    )
  }
  if (accountIsLoading) {
    return <Layout />
  }
  if (!walletAddress || !isAddressInWallet) {
    return (
      <Layout>
        <Box align="start" gap="medium">
          <AlertBox status="error" icon={<CircleAlert size="24px" />}>
            {t('fiatOnramp.notYourAccount', 'You can only use this feature when your wallet is open.')}
          </AlertBox>
          <ButtonLink to="/" label={t('fiatOnramp.openYourWallet', 'Open your wallet')} primary />
        </Box>
      </Layout>
    )
  }

  const transakUrl = `${process.env.REACT_APP_TRANSAK_URL}/?${new URLSearchParams({
    // https://docs.transak.com/docs/query-parameters
    apiKey: process.env.REACT_APP_TRANSAK_PARTNER_ID,
    productsAvailed: 'BUY',
    cryptoCurrencyCode: 'ROSE',
    walletAddress: walletAddress,
    disableWalletAddressForm: 'true',
    isFeeCalculationHidden: 'false',

    exchangeScreenTitle: t('fiatOnramp.headerInWidget', 'Purchase ROSE to your wallet'),
    themeColor: '0500e2',
  }).toString()}`

  return (
    <Layout>
      <Box align="stretch" gap="large">
        {!thirdPartyAcknowledged ? (
          <Box margin={{ top: '20px' }}>
            <CheckBox
              label={t(
                'fiatOnramp.thirdPartyAcknowledge',
                'I understand that I’m using a third-party solution and Oasis* does not carry any responsibility over the usage of this solution.',
              )}
              checked={thirdPartyAcknowledged}
              onChange={event => dispatch(fiatOnrampActions.setThirdPartyAcknowledged(event.target.checked))}
            />
          </Box>
        ) : (
          <div>
            {shouldOpenTransakInNewTab ? (
              <Button
                href={transakUrl}
                target="_blank"
                rel="noopener noreferrer"
                label={t('fiatOnramp.buyNowInNewTab', 'Buy ROSE now')}
                icon={<ShareRounded />}
                reverse
                fill="horizontal"
                margin={{ top: 'small' }}
                style={{ fontSize: '14px', textAlign: 'center' }}
                primary
              />
            ) : (
              <iframe
                height="875"
                title="Transak On/Off Ramp Widget"
                // Expands on https://github.com/Transak/transak-sdk/blob/2ebb3bd/src/index.js#L52
                // and somewhat matches https://docs.transak.com/docs/web-integration#embediframe-webapp
                allow="accelerometer;camera;microphone;fullscreen;gyroscope;payment"
                // Restrict top-navigation
                sandbox={[
                  'allow-downloads',
                  'allow-forms',
                  'allow-modals',
                  'allow-orientation-lock',
                  'allow-pointer-lock',
                  'allow-popups',
                  'allow-popups-to-escape-sandbox',
                  'allow-presentation',
                  'allow-same-origin',
                  'allow-scripts',
                  // 'allow-storage-access-by-user-activation',
                  // 'allow-top-navigation',
                  // 'allow-top-navigation-by-user-activation',
                ].join(' ')}
                src={transakUrl}
                style={{
                  display: 'block',
                  width: '100%',
                  maxHeight: '875px',
                  borderRadius: '3px',
                  border: 'none',
                }}
              ></iframe>
            )}
          </div>
        )}

        <AlertBox status="info">
          <Box direction="row" gap="xsmall">
            <span>*</span>
            <span>
              {t(
                'fiatOnramp.astarFootnote',
                'It is hereby noted that AStar Technologies, a Cayman Islands exempted company is acting on behalf and for the purposes of Oasis, and is also the provider of the ROSE Wallet.',
              )}
            </span>
          </Box>
        </AlertBox>
      </Box>
    </Layout>
  )
}
