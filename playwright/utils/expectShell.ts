import { execSync } from 'child_process'
import { expect } from '@playwright/test'

export function expectShell(cmd: string) {
  return expect.poll(() => {
    try {
      return execSync(cmd, { encoding: 'utf-8' })
    } catch (e) {
      return `exit code ${e.status}: ${e.message}`
    }
  })
}
