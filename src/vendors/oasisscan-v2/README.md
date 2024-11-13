# Typescript bindings for Oasis Scan v2

This folder contains generated typescript bindings for OasisScan v2.

To update the bindings:

1. Update swagger.json based on
   - <https://api.oasisscan.com/v2/swagger/>
   - <https://api.oasisscan.com/v2/swagger/api.json>

2. Generate the bindings:

   ```sh
   npx @openapitools/openapi-generator-cli generate \
    -i swagger.json \
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
    -i swagger.json \
    -g typescript-fetch \
    -o . \
    --additional-properties=modelPropertyNaming=original,typescriptThreePlus=true
   ```

3. Lint:

   ```sh
   yarn lint:fix
   ```
