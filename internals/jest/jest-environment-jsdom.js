// workaround for jest jsdom bug around Uint8Array and ArrayBuffer
const JSDOMEnvironment = require('jest-environment-jsdom')

class MyEnvironment extends JSDOMEnvironment {
  constructor(config) {
    super(
      Object.assign({}, config, {
        globals: Object.assign({}, config.globals, {
          Uint32Array: Uint32Array,
          Uint8Array: Uint8Array,
          ArrayBuffer: ArrayBuffer,
        }),
      }),
    )
  }

  async setup() {}

  async teardown() {}
}

module.exports = MyEnvironment
