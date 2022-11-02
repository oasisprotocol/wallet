import { BrowserContext, TestInfo, expect } from '@playwright/test'

export async function expectNoFatal(context: BrowserContext, testInfo: TestInfo) {
  for (const page of context.pages()) {
    const fatalError = (await page.getByTestId('fatalerror-stacktrace').elementHandles())[0]
    if (fatalError) console.error('fatalerror-stacktrace', await fatalError.textContent())
    expect(fatalError).toBeUndefined()
  }
}
