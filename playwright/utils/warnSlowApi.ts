import { BrowserContext, Page } from '@playwright/test'

export async function warnSlowApi(context: BrowserContext | Page) {
  await context.route('**', async route => {
    await route.continue()
    try {
      await (await route.request().response())?.finished()
      const url = route.request().url()
      const responseTime = route.request().timing().responseEnd
      if (responseTime > 500) console.warn('Slow API', `${responseTime}ms`, url)
    } catch (e) {
      // Ignore error that some requests haven't finished before browser closed.
      if (e.message.endsWith('Target page, context or browser has been closed')) return // @playwright/test@<=1.39
      if (e.message.endsWith('Test ended.')) return // @playwright/test@>=1.40
      throw e
    }
  })
}
