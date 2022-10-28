import { BrowserContext, TestInfo, expect } from '@playwright/test'

export async function expectNoFatal(context: BrowserContext, testInfo: TestInfo) {
  if (testInfo.status === 'passed') {
    for (const page of context.pages()) {
      await expect(page.getByTestId('fatalerror-stacktrace')).toBeHidden({ timeout: 1000 })
    }
  }
}
