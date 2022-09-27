import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  defaultCommandTimeout: 8000,
  e2e: {
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
  },
})
