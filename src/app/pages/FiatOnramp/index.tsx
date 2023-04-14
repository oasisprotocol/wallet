import { Box } from 'grommet/es6/components/Box'
import { ButtonLink } from 'app/components/ButtonLink'
import { useTranslation } from 'react-i18next'
import { Header } from 'app/components/Header'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { useSelector } from 'react-redux'
import { selectAddress } from 'app/state/wallet/selectors'
import { AlertBox } from 'app/components/AlertBox'
import { AnchorLink } from 'app/components/AnchorLink'
import { selectSelectedNetwork } from '../../state/network/selectors'
import { selectAccountIsLoading } from '../../state/account/selectors'

export const IS_FIAT_ONRAMP_ENABLED = !!process.env.REACT_APP_E2E_TEST

export function FiatOnramp() {
  const { t } = useTranslation()
  const selectedNetwork = useSelector(selectSelectedNetwork)
  const accountIsLoading = useSelector(selectAccountIsLoading)
  const isAddressInWallet = useSelector(selectIsAddressInWallet)
  const walletAddress = useSelector(selectAddress)

  if (selectedNetwork !== 'mainnet') {
    return (
      <Box pad="medium" background="background-front">
        <Header>{t('menu.fiatOnramp', 'Fiat on-ramp')}</Header>
        <p>{t('fiatOnramp.notMainnet', 'Not available. Switch to mainnet.')}</p>
      </Box>
    )
  }
  if (accountIsLoading) {
    return (
      <Box pad="medium" background="background-front">
        <Header>{t('menu.fiatOnramp', 'Fiat on-ramp')}</Header>
      </Box>
    )
  }
  if (!walletAddress || !isAddressInWallet) {
    return (
      <Box pad="medium" background="background-front">
        <Header>{t('menu.fiatOnramp', 'Fiat on-ramp')}</Header>
        <p>{t('fiatOnramp.notYourAccount', 'Not available. Open your account.')}</p>
      </Box>
    )
  }

  return (
    <>
      {window.location.hostname === 'localhost' && (
        <AlertBox color="status-warning">
          localhost is{' '}
          <AnchorLink to="https://docs.transak.com/docs/user-journey#redirecturl">
            not a valid redirectURL
          </AnchorLink>
        </AlertBox>
      )}
      <Box pad="medium" background="background-front">
        <Header>{t('menu.fiatOnramp', 'Fiat on-ramp')}</Header>
        <Box direction="row-responsive" justify="start" gap="medium">
          <ButtonLink
            to={`${process.env.REACT_APP_TRANSAK_URL}/?${new URLSearchParams({
              apiKey: process.env.REACT_APP_TRANSAK_PARTNER_ID,
              productsAvailed: 'BUY',
              cryptoCurrencyCode: 'ROSE',
              walletAddress: walletAddress,
              disableWalletAddressForm: 'true',
              redirectURL: new URL(`/account/${walletAddress}`, window.location.href).href,
            }).toString()}`}
            label={t('fiatOnramp.buy', 'Buy')}
            primary
          />
          <ButtonLink
            to={`${process.env.REACT_APP_TRANSAK_URL}/user/orders`}
            label={t('fiatOnramp.viewOrderHistory', 'Order history')}
          />
        </Box>
        <p>Powered by Transak</p>
      </Box>
    </>
  )
}
