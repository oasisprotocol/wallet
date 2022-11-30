import { execSync } from 'child_process'
import { expect } from '@playwright/test'

export function expectShell(cmd: string) {
  let output: string
  try {
    output = execSync(cmd, { encoding: 'utf-8' })
  } catch (e) {
    output = `exit code ${e.status}: ${e.message}`
  }
  return expect(output)
}
