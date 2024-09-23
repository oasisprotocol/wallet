# Typescript bindings for Oasis Scan

This folder contains generated typescript bindings for OasisScan.

To update the bindings:

1. Update swagger.yml based on
   - <https://api.oasisscan.com/mainnet/swagger-ui/>
   - <https://api.oasisscan.com/mainnet/v2/api-docs>
   - <https://github.com/bitcat365/oasisscan-backend>

2. Generate the bindings:

   ```sh
   npx @openapitools/openapi-generator-cli generate \
    -i swagger.yml \
    -g typescript-fetch \
    -o . \
    --additional-properties=modelPropertyNaming=original,typescriptThreePlus=true
   ```

   or

   ```sh
   docker run --rm --user "${UID}:${GID}" \
    -v ${PWD}:/local \
    --workdir /local \
    openapitools/openapi-generator-cli:v5.1.0 generate \
    -i swagger.yml \
    -g typescript-fetch \
    -o . \
    --additional-properties=modelPropertyNaming=original,typescriptThreePlus=true
   ```

3. Lint:

   ```sh
   yarn lint:fix
   ```
