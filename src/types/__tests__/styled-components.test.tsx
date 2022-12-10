import { Box } from 'grommet'

describe('type-only test', () => {
  describe('styled-components.d.ts add types for css property', () => {
    it('correct usage', () => {
      expect(<Box css={{ backgroundColor: 'red' }} />).toBeDefined()
    })

    it('detect mistakes', () => {
      // @ts-expect-error Detect incorrect type
      expect(<Box css={{ backgroundColor: 5 }} />).toBeDefined()
    })
  })
})
