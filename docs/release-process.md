# Release Process

## Web wallet

Make a release:

- ```sh
  pip3 install --upgrade \
    https://github.com/oasisprotocol/towncrier/archive/oasis-master.tar.gz
  ```

- `yarn changelog`, commit "Assemble changes for ___ release", and merge PR
- `yarn release-tag`
  ([.github/workflows/release.yml](/.github/workflows/release.yml) then creates
  a github release)

Staging:

- download from [releases]
- deploy to <https://wallet.stg.oasis.io/>

Production:

- ensure <https://wallet.stg.oasis.io/> works
  - especially features related to changes
  - look at CSP errors
- see the footer for what commit is deployed
- deploy staged build to <https://wallet.oasis.io/>

### Deploy

Update Terraform module in oasisprotocol/internal-ops with security headers
from Content-Security-Policy.txt and Permissions-Policy.txt, e.g.
<https://github.com/oasisprotocol/internal-ops/pull/1022/changes>

Verify deployed version by opening the page in
incognito (no cache) - it is displayed in the footer.

Verify security headers were updated:

- See deployed headers

  ```sh
  curl --head https://wallet.stg.oasis.io/ -s | grep "content-security-policy\|permissions-policy"
  curl --head https://wallet.oasis.io/ -s | grep "content-security-policy\|permissions-policy"
  ```

- Compare to Content-Security-Policy.txt and Permissions-Policy.txt in
  [releases]

## Extension wallet

- download rose-wallet-ext-*.zip from [releases]
- download [screenshots]
- upload to [Chrome Web Store]

## Mobile app

- download rose-wallet-android-*.aab from [releases]
- download [screenshots]
- upload to [Play Store]
- promote [to production] and wait for google to review

[releases]: https://github.com/oasisprotocol/wallet/releases
[screenshots]: https://github.com/oasisprotocol/wallet/tree/master/playwright/screenshots
[Chrome Web Store]: https://chrome.google.com/webstore/devconsole/6ed673e9-0220-4b12-8378-41c35ae7a50b/ppdadbejkmjnefldpcdjhnkpbjkikoip/edit/package
[Play Store]: https://play.google.com/console/u/0/developers/6581971779742676467/app/4976309565338229564/tracks/internal-testing
[to production]: https://play.google.com/console/u/0/developers/6581971779742676467/app/4976309565338229564/tracks/production
