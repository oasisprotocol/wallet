// eslint-disable-next-line no-restricted-imports
import { Button as ButtonOriginal } from 'grommet'
import { Button } from './Button'

describe('type-only test', () => {
  describe('Button is strictly typed', () => {
    it('correct usage', () => {
      expect(<Button type="button" onClick={() => {}}></Button>).toBeDefined()
      expect(<Button onClick={() => {}}></Button>).toBeDefined()
      expect(<Button type="submit"></Button>).toBeDefined()
    })

    it('detect incorrect usage', () => {
      // @ts-expect-error Expect typescript to detect incorrect usage
      expect(<Button type="submit" onClick={() => {}}></Button>).toBeDefined()
    })

    it('original Button is not strict', () => {
      expect(<ButtonOriginal type="submit" onClick={() => {}}></ButtonOriginal>).toBeDefined()
    })
  })
})
