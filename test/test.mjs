import puppeteer from 'puppeteer'
const extension_id = 'knkmolcoonadailjhhnnnaefabkbelgm' // XXX how to get id programmatically?
const path = '../dist/ext/'
const browser = await puppeteer.launch({
  headless: false,
  args: [`--disable-extensions-except=${path}`, `--load-extension=${path}`, `--window-size=800,600`],
})
const page = await browser.newPage()
let output = []
page.on('console', message => output.push(message.text())).on('pageerror', ({ message }) => output.push(message))
await page.goto(`chrome-extension://${extension_id}/static/popup.html`)
await page.screenshot({ path: 'screenshot.png' })
await browser.close()

console.log(output)
