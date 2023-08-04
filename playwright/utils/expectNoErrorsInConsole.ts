import { ConsoleMessage, Page, expect } from '@playwright/test'

async function forwardCSPViolationsToConsole(page: Page) {
  await page.evaluate(() => {
    document.addEventListener('securitypolicyviolation', event => {
      const parsedEvent = {
        violatedDirective: event.violatedDirective,
        at: `${event.sourceFile}:${event.lineNumber}:${event.columnNumber}`,
        blockedURI: event.blockedURI,
        sample: event.sample,
      }
      console.error(event, parsedEvent)
    })
  })
}

export async function expectNoErrorsInConsole(
  page: Page,
  params?: { ignoreError?: (message: ConsoleMessage) => boolean | void },
) {
  await forwardCSPViolationsToConsole(page)
  page.on('domcontentloaded', async () => {
    // Attach again after navigation
    await forwardCSPViolationsToConsole(page)
  })

  page.on('pageerror', error => {
    expect(error).toBeUndefined()
  })
  page.on('console', message => {
    if (message.type() === 'error' && !params?.ignoreError?.(message)) {
      expect({
        args: message.args(),
        location: message.location(),
        text: message.text(),
        type: message.type(),
      }).not.toMatchObject({
        type: 'error',
      })
    }
  })
}
