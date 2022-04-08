/**
 *
 * NetworkDowntimeNotification
 *
 */
import { Trans, useTranslation } from 'react-i18next'
import { Anchor, Box, Text } from 'grommet'
import { dateFormat } from 'app/components/DateFormatter'

const downtimeStartDate = dateFormat.format(new Date(Date.UTC(2022, 3, 11, 8, 30, 0, 0)))
const downtimeEndDate = dateFormat.format(new Date(Date.UTC(2022, 3, 11, 12, 30, 0, 0)))

export function NetworkDowntimeNotification() {
  const { t } = useTranslation()

  return (
    <Box background="background-front" margin={{ top: 'small', left: 'small', right: 'small' }}>
      <Box
        border={{
          color: 'status-warning',
          side: 'left',
          size: '3px',
        }}
        background={{
          color: 'status-warning',
          opacity: 'weak',
        }}
        pad={{ horizontal: 'small', vertical: 'xsmall' }}
      >
        <Text weight="bold">
          <Trans
            i18nKey="downtimeNotification"
            t={t}
            components={[
              <Anchor
                href="https://medium.com/oasis-protocol-project/oasis-network-damask-upgrade-secured-a-big-majority-vote-from-validators-168a6d48e9a3"
                target="_blank"
                rel="noopener"
              />,
            ]}
            values={{
              downtimeStartDate,
              downtimeEndDate,
            }}
          />
        </Text>
      </Box>
    </Box>
  )
}
