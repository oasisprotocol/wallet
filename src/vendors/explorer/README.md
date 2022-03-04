# Typescript bindings for Oasis Explorer

This folder contains generated typescript bindings for OasisExplorer.

To update the bindings:

1. Download a fresh version of swagger.yml:

    ```sh
    wget "https://raw.githubusercontent.com/everstake/oasis-explorer/master/swagger/swagger.yml"
    ```

2. Generate the bindings:

    ```sh
    npx @openapitools/openapi-generator-cli generate -i swagger.yml -g typescript-fetch -o . --additional-properties=modelPropertyNaming=snake_case,typescriptThreePlus=true,sagasAndRecords=true
    ```
    or
    ```sh
    docker run --rm --user "${UID}:${GID}" -v ${PWD}:/local --workdir /local openapitools/openapi-generator-cli:v5.1.0 generate -i swagger.yml -g typescript-fetch -o . --additional-properties=modelPropertyNaming=snake_case,typescriptThreePlus=true,sagasAndRecords=true
    ```

3. Lint:

    ```sh
    yarn lint:fix
    ```
