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

function HeaderLayout(props: { children?: React.ReactNode }) {
  const { t } = useTranslation()
  return (
    <Box
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
      background="background-front"
      pad="medium"
    >
      <Header>{t('fiatOnramp.header', 'Buy ROSE')}</Header>
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
  const thirdPartyAcknowledged = useSelector(selectThirdPartyAcknowledged)

  if (selectedNetwork !== 'mainnet') {
    return (
      <HeaderLayout>
        <AlertBox status="error" icon={<CircleAlert size="24px" color="currentColor" />}>
          {t('fiatOnramp.notMainnet', 'You can only use this feature when your are on the mainnet.')}
        </AlertBox>

        <Button
          onClick={() => dispatch(networkActions.selectNetwork('mainnet'))}
          label={t('fiatOnramp.switchToMainnet', 'Switch to Mainnet')}
          primary
        />
      </HeaderLayout>
    )
  }
  if (accountIsLoading) {
    return <HeaderLayout />
  }
  if (!walletAddress || !isAddressInWallet) {
    return (
      <HeaderLayout>
        <AlertBox status="error" icon={<CircleAlert size="24px" color="currentColor" />}>
          {t('fiatOnramp.notYourAccount', 'You can only use this feature when your wallet is open.')}
        </AlertBox>
        <ButtonLink to="/" label={t('fiatOnramp.openYourWallet', 'Open your wallet')} primary />
      </HeaderLayout>
    )
  }

  return (
    <Box gap="small">
      <HeaderLayout></HeaderLayout>

      <Box
        round="5px"
        border={{ color: 'background-front-border', size: '1px' }}
        background="background-front"
        pad="medium"
        alignSelf="center"
        width="601px" // Transak threshold for >mobile layout
        style={{ boxSizing: 'content-box' }}
      >
        <AlertBox status="error" icon={<CircleAlert size="24px" color="currentColor" />}>
          {t(
            'fiatOnramp.thirdPartyDisclaimer',
            'This service is provided by an external party. Oasis* does not carry any responsibility. All fees charged by Transak.',
          )}
        </AlertBox>

        {!thirdPartyAcknowledged ? (
          <Box margin={{ top: '20px', bottom: '400px' }}>
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
          <iframe
            height="875"
            title="Transak On/Off Ramp Widget"
            allow="camera;microphone;fullscreen;payment"
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
            src={`${process.env.REACT_APP_TRANSAK_URL}/?${new URLSearchParams({
              // https://docs.transak.com/docs/query-parameters
              apiKey: process.env.REACT_APP_TRANSAK_PARTNER_ID,
              productsAvailed: 'BUY',
              cryptoCurrencyCode: 'ROSE',
              walletAddress: walletAddress,
              disableWalletAddressForm: 'true',
              isFeeCalculationHidden: 'false',

              exchangeScreenTitle: t('fiatOnramp.headerInWidget', 'Purchase ROSE to your wallet'),
              themeColor: '#18213c',
            }).toString()}`}
            style={{
              display: 'block',
              width: '100%',
              maxHeight: '875px',
              borderRadius: '3px',
              border: 'none',
            }}
          ></iframe>
        )}

        <br />
        <AlertBox status="info">
          <Box direction="row" gap="xsmall">
            <span>*</span>
            <span>
              {t(
                'fiatOnramp.astarFootnote',
                'It is hereby noted that AStar Technologies, a Cayman Islands exempted company is acting on behalf and for the purposes of Oasis, and is also the provider of the Oasis Wallet.',
              )}
            </span>
          </Box>
        </AlertBox>
      </Box>
    </Box>
  )
}
