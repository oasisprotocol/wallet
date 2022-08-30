import { render, screen } from '@testing-library/react'

import { intlDateTimeFormat, DateFormatter } from '..'
import { buildDatetime } from '../../../../../internals/getBuildData'

describe('intlDateTimeFormat', () => {
  it('should format date to human readable format', () => {
    expect(intlDateTimeFormat(1656932251000)).toEqual('7/4/2022, 10:57:31 AM')
    expect(intlDateTimeFormat(new Date(Date.UTC(2022, 6, 27, 8, 33, 10)))).toEqual('7/27/2022, 8:33:10 AM')
  })
  it('build time should be in the same format as a tested timestamp', () => {
    expect(Number(buildDatetime)).toBeCloseTo(1656932251000, -12) // Less than 16 years difference
  })
})

describe('<DateFormatter  />', () => {
  it('should render component with formatted date', () => {
    render(<DateFormatter date={1656932251000} />)
    expect(screen.getByText('7/4/2022, 10:57:31 AM')).toBeInTheDocument()
  })
})
