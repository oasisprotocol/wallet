import { render } from '@testing-library/react'

import { ProfileModalButton } from '..'
import { addressToJazzIconSeed } from '../addressToJazzIconSeed'

describe('<ProfileModalButton  />', () => {
  it.skip('should match snapshot', () => {
    const component = render(<ProfileModalButton />)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('addressToJazzIconSeed for JazzIcon should return the same value as extension wallet', () => {
    expect(addressToJazzIconSeed('oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe')).toBe(-323287268)
    expect(addressToJazzIconSeed('oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')).toBe(-77419490)
  })
})
