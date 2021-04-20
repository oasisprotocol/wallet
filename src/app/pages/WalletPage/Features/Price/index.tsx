/**
 *
 * Price
 *
 */
import { Box, DataChart } from 'grommet'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

const data: any[] = []
for (let i = 1; i < 8; i += 1) {
  const v = Math.sin(i / 2.0)
  data.push({
    date: `2020-${((i % 12) + 1).toString().padStart(2, '0')}-01`,
    percent: Math.round(Math.abs(v * 100)),
  })
}

interface Props {}

export const Price = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation()

  return (
    // <div>
    //   {t('')}
    //   {/*  {t(...messages.someThing())}  */}
    // </div>
    <Box pad="small" width="medium" alignSelf="end">
      <DataChart
        data={data}
        series={['date', 'percent']}
        chart={[
          { property: 'percent', thickness: 'xxsmall', type: 'line', color: 'brand' },
          {
            property: 'percent',
            thickness: 'xxxsmall',
            type: 'point',
            // point: 'diamond',
          },
        ]}
        guide={{ x: { granularity: 'coarse' }, y: { granularity: 'coarse' } }}
        size={{ width: 'fill', height: 'fill' }}
        detail
      />
    </Box>
  )
})
