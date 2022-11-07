import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { useParaTimes, ParaTimesHook } from '../../useParaTimes'
import { ParaTimeContent } from '..'

jest.mock('../../useParaTimes')

describe('<ParaTimeContent />', () => {
  const mockUseParaTimesResult = {
    isDepositing: true,
  } as ParaTimesHook

  beforeEach(() => {
    jest.mocked(useParaTimes).mockReturnValue(mockUseParaTimesResult)
  })

  it('should render custom header', () => {
    render(<ParaTimeContent description="Description" header="Header" />)

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.queryByText('paraTimes.common.depositHeader')).not.toBeInTheDocument()
    expect(screen.queryByText('paraTimes.common.withdrawHeader')).not.toBeInTheDocument()
  })

  it('should render default deposit header', () => {
    render(<ParaTimeContent description="Description" />)

    expect(screen.queryByText('paraTimes.common.depositHeader')).toBeInTheDocument()
  })

  it('should render default withdraw header', () => {
    jest.mocked(useParaTimes).mockReturnValue({ ...mockUseParaTimesResult, isDepositing: false })
    render(<ParaTimeContent description="Description" />)

    expect(screen.queryByText('paraTimes.common.withdrawHeader')).toBeInTheDocument()
  })

  it('should render loading state', () => {
    render(
      <ParaTimeContent description="Description" isLoading={true}>
        children
      </ParaTimeContent>,
    )

    expect(screen.getByTestId('paraTime-content-loading')).toBeInTheDocument()
    expect(screen.queryByText('children')).not.toBeInTheDocument()
  })
})
