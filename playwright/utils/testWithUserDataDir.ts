import fs from 'fs'
import os from 'os'
import path from 'path'

import { test as base, BrowserContext as BaseBrowserContext, BrowserType } from '@playwright/test'
import { expectShell } from './expectShell'

interface BrowserContext extends BaseBrowserContext {
  userDataDir: string
}

export const testWithUserDataDir = (browser: BrowserType) => {
  return base.extend<{
    context: BrowserContext
  }>({
    // eslint-disable-next-line no-empty-pattern
    context: async ({}, use) => {
      const userDataDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'playwright-test-'))
      const context = (await browser.launchPersistentContext(userDataDir, {
        headless: false,
      })) as BrowserContext
      context.userDataDir = userDataDir
      console.log('userDataDir', userDataDir)

      await use(context)
      await context.close()
      await fs.promises.rm(userDataDir, { recursive: true, force: true })
    },
  })
}

export function expectPasswordInUserData(userDataDir: string) {
  if (!/^[\w-:/\\]+$/.test(userDataDir)) {
    throw new Error('userDataDir contains dangerous characters')
  }
  return expectShell(
    `grep -E "(a.b.c.d.1.2.3.4.&)|(abcd1234&)" --text --only-matching --recursive "${userDataDir}"`,
  )
}

export function expectPrivateKeyInUserData(userDataDir: string) {
  if (!/^[\w-:/\\]+$/.test(userDataDir)) {
    throw new Error('userDataDir contains dangerous characters')
  }
  return expectShell(
    `grep -E "(X.0.j.l.p.v.s.k)|(X0jlpvsk)" --text --only-matching --recursive "${userDataDir}"`,
  )
}

export function expectMnemonicInUserData(userDataDir: string) {
  if (!/^[\w-:/\\]+$/.test(userDataDir)) {
    throw new Error('userDataDir contains dangerous characters')
  }
  return expectShell(
    `grep -E "(planet believe)|(p.l.a.n.e.t. .b.e.l.i.e.v.e)" --text --only-matching --recursive "${userDataDir}"`,
  )
}
