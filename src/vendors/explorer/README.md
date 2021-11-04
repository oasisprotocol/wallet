# Typescript bindings for Oasis Explorer

This folder contains generated typescript bindings for OasisExplorer.

To update the bindings:

1. Download a fresh version of swagger.yml:

    ```sh
    wget "https://raw.githubusercontent.com/everstake/oasis-explorer/master/swagger/swagger.yml"
    ```

2. Generate the bindings:

    ```sh
    npx @openapitools/openapi-generator-cli generate -i swagger.yml -g typescript-fetch -o . --additional-properties=modelPropertyNaming=snake_case,typescriptThreePlus=true
    ```

3. Reapply hotfix (commit generated changes first):

    ```sh
    git cherry-pick 'HEAD^{/^hotfix: Return empty list of validators, if oasismonitor\.com is down}'
    ```
