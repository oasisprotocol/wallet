import { BrowserContext } from '@playwright/test'

export async function warnSlowApi(context: BrowserContext) {
  await context.route('**', async route => {
    await route.continue()
    await (await route.request().response())?.finished()
    const url = route.request().url()
    const responseTime = route.request().timing().responseEnd
    if (responseTime > 500) console.warn('Slow API', `${responseTime}ms`, url)
  })
}
