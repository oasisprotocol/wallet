# Oasis Wallet

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![codecov](https://codecov.io/gh/oasisprotocol/oasis-wallet-web/branch/master/graph/badge.svg)](https://codecov.io/gh/oasisprotocol/oasis-wallet-web)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![Build status](https://github.com/oasisprotocol/oasis-wallet-web/actions/workflows/build-test.yaml/badge.svg)](https://github.com/oasisprotocol/oasis-wallet-web/actions)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FEsya%2Foasis-wallet.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FEsya%2Foasis-wallet?ref=badge_shield)

> :warning: **NEVER use the private keys and mnemonics given as example in this repository.**

<img src="docs/images/demo.gif">

- [Oasis Wallet](#oasis-wallet)
  - [Features](#features)
    - [Additional features coming soon](#additional-features-coming-soon)
  - [Getting started](#getting-started)
    - [Installing and running oasis-wallet](#installing-and-running-oasis-wallet)
    - [Test accounts](#test-accounts)
  - [Architecture](#architecture)
  - [Contributing & development](#contributing--development)
    - [Running the tests](#running-the-tests)
    - [Code style](#code-style)
    - [Internationalization](#internationalization)
  - [License](#license)

## Deploys

- `stable` branch: <https://wallet.oasisprotocol.org>
- `master` branch: <https://wallet.stg.oasisprotocol.org>

## Features

- Opening wallets through private key or mnemonic
- Transaction history, currently all transactions are listed. We need to submit a pull-request to [oasis-explorer](https://github.com/everstake/oasis-explorer) to support pagination
- Multiple languages (English and French currently supported)
- Submitting transactions
- [Ledger](http://ledger.com/) support
- Multiple accounts open in parallel
- Staking (Adding / reclaiming escrow)

## Getting started

### Installing and running oasis-wallet

You can quickly get started with the following commands:

```shell
yarn install
yarn start
```

Alternatively, to get started with a local network:

```shell
docker-compose up --build -d
yarn install
REACT_APP_LOCALNET=1 yarn start
```

Then go to [http://localhost:3000](http://localhost:3000) to access the wallet.

### Test accounts

The local single-node network used for development comes built-in with two accounts already having tokens.

```none
Using a private key:
X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg==
oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk

Using a mnemonic:
abuse gown claw final toddler wedding sister parade useful typical spatial skate decrease bulk student manual cloth shove fat car little swamp tag ginger
oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l
```

## Architecture

Oasis-wallet needs multiple components to run, all provided in the [docker-compose file](docker-compose.yml) for local development.

<img src="docs/images/architecture.svg">

- [envoy-proxy](https://www.envoyproxy.io/), used as a gRPC gateway for live access to the oasis-node, to fetch live balance, information about the current state of the network, and to submit transasctions.
- [oasis-monitor](https://github.com/everstake/oasis-explorer), a block indexer to store historical data about transactions, accounts, validators, rewards, blocks and more. It exposes an [OpenAPI](https://github.com/everstake/oasis-explorer/blob/master/swagger/swagger.yml). Oasis Monitor dashboard is available at [https://oasismonitor.com](https://oasismonitor.com). `oasis-monitor` requires two databases:

  - A PostgreSQL instance to keep track of it's import batches
  - A [Clickhouse](https://github.com/ClickHouse/ClickHouse) server to store the indexed data

- [oasis-scan](https://github.com/bitcat365/oasisscan-backend), oasis blockchain explorer that enables view of historical data about transactions, accounts, validators, paratimes, blocks, proposals and more. It exposes an [API](https://github.com/bitcat365/oasisscan-backend#oasisscan-api). Oasis scan dashboard is available at [https://www.oasisscan.com](https://www.oasisscan.com).

API that web wallet is using is determined during a build time.

## Contributing & development

### Running the tests

The repository has two different test strategies:

- E2E (End-to-end) tests, run with [Cypress](https://www.cypress.io/), located in [cypress/](/cypress). These tests require the react app to be started to be accessible on port `3000` and the docker-compose stack to be up.
- Unit & functional tests, run with [Jest](https://github.com/facebook/jest), located throughout the codebase

To run all tests:

```bash
# Check typescript errors
yarn checkTs

# Run jest tests
yarn test

# Run cypress tests
docker-compose up -d
REACT_APP_LOCALNET=1 REACT_APP_BACKEND=oasismonitor yarn start # Run this in another terminal to keep it open
yarn cypress:run

# Manually check that content-security-policy in ./internals/getCsp.js doesn't break any functionality
yarn --silent print-csp
yarn start:prod
# Open http://localhost:5000/account/oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe/stake and switch to testnet.
# This exercises at least: fonts, grpc, testnet grpc, API, and validator logos
```

### Code style

This repository uses [prettier](https://prettier.io/) as a code formatter and [eslint](https://github.com/eslint/eslint) as it's linter. You can use the following commands:

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

A detailed post on Git commit messages: [How To Write a Git Commit Message](https://chris.beams.io/posts/git-commit/).

### Internationalization

We have [Transifex](https://www.transifex.com/oasisprotocol/oasis-wallet-web/) to easily contribute translations.

Oasis-wallet uses [react-i18next](https://react.i18next.com/) for I18n. You can simply use the [useTranslation hook](https://react.i18next.com/latest/usetranslation-hook) inside your components to add additional i18n-ready strings. You can then export the new keys to the translation files by running

```shell
yarn run extract-messages
```

To add a new language, edit [src/locales/i18n.ts](src/locales/i18n.ts) and [i18next-scanner.config.js](internals/extractMessages/i18next-scanner.config.js), then run the command above once more.

## Preparing a Release

[Release process doc](docs/release-process.md)

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FEsya%2Foasis-wallet.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FEsya%2Foasis-wallet?ref=badge_large)
