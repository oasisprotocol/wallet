# Release Process

## Web wallet

Staging:
- checkout `master` branch
- build
- deploy to <https://wallet.stg.oasisprotocol.org/>

Production:
- ensure <https://wallet.stg.oasisprotocol.org/> works
  - especially features related to changes
  - look at CSP errors (expect one error: blocked `eval` in `inquire`)
- see the footer for what commit is deployed
- update `stable` branch to that commit
- build
- deploy to <https://wallet.oasisprotocol.org/>

### Build

```sh
yarn install --frozen-lockfile
yarn build  # uses oasisscan backend
# or  REACT_APP_BACKEND=oasismonitor yarn build
```

### Deploy

Manually deploy `./build/` folder by following <https://github.com/oasisprotocol/oasis-wallet-web/wiki/Deployment-on-AWS>.

Verify deployed version by opening the page in incognito (no cache) - it is displayed in the footer.

Update Content-Security-Policy header.

```sh
yarn print-csp

# See old deployed CSP
curl --head https://wallet.stg.oasisprotocol.org/ -s | grep content-security-policy
curl --head https://wallet.oasisprotocol.org/ -s | grep content-security-policy
```


## TODO: Extension wallet

- Update version in `manifest.json`
- Changelog
- Commit
- Make PR and merge
- Git tag
- Build

```sh
VERSION=`cat extension/src/manifest.json | jq .version -r`
COMMIT=`git rev-parse --short HEAD`
yarn install --frozen-lockfile
yarn build:ext
zip -r oasis-wallet-$VERSION-$COMMIT.zip build-ext/
```

- GitHub pre-release with zip file
- Chrome store
- Update pre-release
