# ROSE Wallet

[![CI build status][github-ci-build-badge]][github-ci-build-link]
[![CI test status][github-ci-test-badge]][github-ci-test-link]
[![CI lint status][github-ci-lint-badge]][github-ci-lint-link]
[![Release status][github-release-badge]][github-release-link]
[![License][license-badge]][license-link]
[![codecov][codecov-badge]][codecov-link]
[![Renovate enabled][github-renovate-badge]][github-renovate-link]

> :warning: **NEVER use the private keys and mnemonics given as examples
> in this repository.**

[demo-video]

## Deploys

- Production browser extension: [chromewebstore.google.com]

- Production / Stable deploy: <https://wallet.oasis.io>

  The main deploy of the wallet available to the general public.

- Staging deploy: <https://wallet.stg.oasis.io>

  A deploy of the latest released version of the wallet available for users
  wanting to try out and test the latest version.

- Development deploy: <https://wallet.dev.oasis.io>

  A deploy of the latest code in the `master` branch available for power users
  and developers to try out the latest (unreleased) version.

## Features

### Wallet and Accounts

- Create/Restore wallets using standard [BIP-0039] mnemonic phrases
- Import accounts from your [Ledger] hardware wallet
- Import accounts directly from their private keys
- Address book of your saved contacts
- Create a profile to quickly access stored accounts with a password

### Transactions

- View transaction history
- Send ROSE tokens between Consensus accounts
- Stake/Debond ROSE tokens
- Deposit and withdraw from ParaTimes (Sapphire, Emerald, Cipher)

### Accessibility

- Available in multiple languages
- Should not crash when using Google Translate

## Getting started

### Installing and running from source code

You can quickly get started with the following commands:

```shell
yarn install
yarn start
```

Then go to <http://localhost:3000> to access the wallet.

### Test accounts

The local single-node network used for development comes built-in with two
accounts already having tokens.

```none
Using a private key:
X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg==
oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk

Using a mnemonic:
abuse gown claw final toddler wedding sister parade useful typical spatial skate
decrease bulk student manual cloth shove fat car little swamp tag ginger
oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l
```

## Architecture

![Architecture diagram](docs/images/architecture.svg)

- [envoy-proxy], used as a gRPC gateway for live access to the oasis-node, to
  fetch live balance, information about the current state of the network, and to
  submit transactions.
- [oasis-nexus], is the official indexer for the Oasis Network, providing
the backend for the Oasis Explorer and ROSE Wallet.
It exposes an [API][oasis-nexus-api-spec].

- [oasis-scan], oasis blockchain explorer that enables view of historical data
  about transactions, accounts, validators, paratimes, blocks, proposals and
  more. It exposes an [API][scan-api-repo].

API that web wallet is using is determined during a build time.

## Contributing & development

### Running the tests

The repository has two different test strategies:

- E2E (End-to-end) tests, run with [Playwright], located in
  [playwright/](/playwright).
  These tests require the react app to be accessible on port `3000`.
- Unit & functional tests, run with [Jest], located throughout the codebase

To run all tests:

```bash
# Check typescript errors
yarn checkTs

# Run jest tests
yarn test

# Run playwright tests
yarn start
(cd playwright; yarn; npx playwright install --with-deps)
(cd playwright; yarn test)
# Or `yarn start:prod` and `yarn test:prod` to test production builds.
# Or `xvfb-run yarn test` to prevent browser windows opening.

# Manually check that content-security-policy in getSecurityHeaders.js doesn't
# break any functionality
yarn start:prod
# Open http://localhost:5000/account/oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe/stake
# and switch to testnet. This exercises at least: fonts, grpc, testnet grpc, API,
# and validator logos.

# Update screenshots
(cd playwright; yarn test:screenshots)
```

### Code style

This repository uses [prettier] as a code formatter and [eslint] as it's linter.
You can use the following commands:

```bash
# Lint the whole repository
yarn lint

# Fix linting issues
yarn lint:fix
```

#### Git Commit Messages

A quick summary:

- Separate subject from body with a blank line.
- Limit the subject line to 72 characters.
- Capitalize the subject line.
- Do not end the subject line with a period.
- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move component to..." not "Moves component to...").
- Wrap the body at 80 characters.
- Use the body to explain _what_ and _why_ vs. _how_.

A detailed post on Git commit messages: [How To Write a Git Commit Message].

### Internationalization

Translating: We have [Transifex] to easily contribute translations.

Development: ROSE Wallet uses [react-i18next] for internationalization.
You can simply use the [useTranslation hook] inside your components to add
additional translation-ready strings. You can then export the new keys to the
[English translation.json] by running `yarn run extract-messages`.

Updating from [Transifex]: [English translation.json] is set as an automatically
updating resource in Transifex, so the new translation strings will appear in
Transifex a few hours after changes are merged. After they are translated:

1. click "Download file to translate" on the target languages,
2. `yarn run extract-messages`, and
3. create a new pull request titled _"i18n: Update translations from
   Transifex"_.

Adding a new language:

1. first add it to Transifex and translate the strings,
2. create a folder with the new language code in `src/locales`
   and download the translation file there,
3. add the new language to the [list of resources][i18n.ts]

## Mobile app development

[Capacitor and Ionic docs](docs/mobile-development.md)

## Preparing a Release

[Release process doc](docs/release-process.md)

[demo-video]: https://github.com/oasisprotocol/wallet/assets/3758846/ef11fbea-dd55-42b1-87a4-1b74509a2809
[chromewebstore.google.com]: https://chromewebstore.google.com/detail/rose-wallet/ppdadbejkmjnefldpcdjhnkpbjkikoip
[envoy-proxy]: https://www.envoyproxy.io
[oasis-nexus]: https://github.com/oasisprotocol/nexus
[oasis-nexus-api-spec]: https://nexus.oasis.io/v1/spec/v1.html
[oasis-scan]: https://www.oasisscan.com
[scan-api-repo]: https://github.com/bitcat365/oasisscan-backend#oasisscan-api
[Jest]: https://github.com/facebook/jest
[prettier]: https://prettier.io/
[eslint]: https://github.com/eslint/eslint
[How To Write a Git Commit Message]: https://chris.beams.io/posts/git-commit/
[Transifex]: https://www.transifex.com/oasisprotocol/oasis-wallet-web/
[react-i18next]: https://react.i18next.com/
[useTranslation hook]: https://react.i18next.com/latest/usetranslation-hook
[English translation.json]: src/locales/en/translation.json
[i18n.ts]: src/locales/i18n.ts
[github-ci-build-badge]: https://github.com/oasisprotocol/wallet/actions/workflows/ci-build.yml/badge.svg
[github-ci-build-link]: https://github.com/oasisprotocol/wallet/actions?query=workflow:ci-build+branch:master
[github-ci-test-badge]: https://github.com/oasisprotocol/wallet/actions/workflows/ci-test.yml/badge.svg
[github-ci-test-link]: https://github.com/oasisprotocol/wallet/actions?query=workflow:ci-test+branch:master
[github-ci-lint-badge]: https://github.com/oasisprotocol/wallet/actions/workflows/ci-lint.yml/badge.svg
[github-ci-lint-link]: https://github.com/oasisprotocol/wallet/actions?query=workflow:ci-lint+branch:master
[github-release-badge]: https://github.com/oasisprotocol/wallet/actions/workflows/release.yml/badge.svg
[github-release-link]: https://github.com/oasisprotocol/wallet/actions?query=workflow:release
[github-renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg
[github-renovate-link]: https://www.mend.io/renovate/
[license-badge]: https://img.shields.io/badge/License-Apache%202.0-blue.svg
[license-link]: https://opensource.org/licenses/Apache-2.0
[codecov-badge]: https://codecov.io/gh/oasisprotocol/oasis-wallet-web/branch/master/graph/badge.svg
[codecov-link]: https://codecov.io/gh/oasisprotocol/oasis-wallet-web
[BIP-0039]: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
[Ledger]: https://ledger.com/
