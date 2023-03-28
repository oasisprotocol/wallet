import { Box } from 'grommet'
import { ButtonLink } from 'app/components/ButtonLink'
import { useTranslation } from 'react-i18next'
import { Header } from 'app/components/Header'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { useSelector } from 'react-redux'
import { selectAddress } from 'app/state/wallet/selectors'

export function FiatOnramp() {
  const { t } = useTranslation()
  const isAddressInWallet = useSelector(selectIsAddressInWallet)
  const walletAddress = useSelector(selectAddress)
  if (!walletAddress || !isAddressInWallet) {
    return <p>Not available</p>
  }

  return (
    <>
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
