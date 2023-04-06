import React from 'react'
import { Box, Button, Text } from 'grommet'
import { useTranslation } from 'react-i18next'
import { ParaTimeContent } from '../ParaTimeContent'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'

export const ParaTimeTransferType = () => {
  const { t } = useTranslation()
  const { accountIsLoading, isWalletEmpty, ticker } = useParaTimes()
  const { navigateToDeposit, navigateToWithdraw } = useParaTimesNavigation()
  const disabled = !accountIsLoading && isWalletEmpty

  return (
    <ParaTimeContent
      header={t('paraTimes.common.header', 'ParaTime Transfers')}
      description={t(
        'paraTimes.transfers.description',
        'Click on the "Deposit" button to deposit your {{ticker}} from consensus to a ParaTime of your choice or "Withdraw" to withdraw your {{ticker}} from a ParaTime back to consensus.',
        {
          ticker,
        },
      )}
    >
      <Box gap="medium" responsive={false}>
        <Box>
          <Button
            disabled={disabled}
            fill="horizontal"
            label={t('paraTimes.transfers.deposit', 'Deposit to ParaTime')}
            onClick={navigateToDeposit}
            primary
          />
          {disabled && (
            <Text size="small" margin={{ top: 'xsmall' }}>
              {t('paraTimes.transfers.depositDisabled', "You don't have any {{ticker}} tokens to transfer", {
                ticker,
              })}
            </Text>
          )}
        </Box>
        <Button
          fill="horizontal"
          label={t('paraTimes.transfers.withdraw', 'Withdraw from ParaTime')}
          onClick={navigateToWithdraw}
        />
      </Box>
    </ParaTimeContent>
  )
}
