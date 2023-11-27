# Release Process

## Web wallet

Staging:

- checkout `master` branch
- `yarn install --frozen-lockfile && yarn build`
- deploy to <https://wallet.stg.oasis.io/>

Production:

- ensure <https://wallet.stg.oasis.io/> works
  - especially features related to changes
  - look at CSP errors
- see the footer for what commit is deployed
- update `stable` branch to that commit
- `yarn install --frozen-lockfile && yarn build`
- deploy to <https://wallet.oasis.io/>

### Deploy

Manually deploy `./build/` folder by following
<https://github.com/oasisprotocol/oasis-wallet-web/wiki/Deployment-on-AWS>.

Verify deployed version by opening the page in
incognito (no cache) - it is displayed in the footer.

Update Content-Security-Policy and Permissions-Policy headers.

```sh
# See old deployed headers
curl --head https://wallet.stg.oasis.io/ -s | grep "content-security-policy\|permissions-policy"
curl --head https://wallet.oasis.io/ -s | grep "content-security-policy\|permissions-policy"
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
