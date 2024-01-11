import * as React from 'react'
import { render } from '@testing-library/react'
import { useParaTimes, ParaTimesHook } from '../../useParaTimes'
import { ParaTimesPageInaccessibleForeign } from '..'

jest.mock('../../useParaTimes')

describe('<ParaTimesPageInaccessible />', () => {
  it('should render component', () => {
    jest.mocked(useParaTimes).mockReturnValue({} as ParaTimesHook)
    const { container } = render(<ParaTimesPageInaccessibleForeign />)

    expect(container).toMatchSnapshot()
  })
})
