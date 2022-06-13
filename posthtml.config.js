// This seems to run before .env files are loaded.
module.exports = {
  plugins: {
    'posthtml-expressions': {
      locals: {
        REACT_APP_META_CSP: process.env.REACT_APP_META_CSP,
      },
    },
  },
}
