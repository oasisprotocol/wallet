# Typescript bindings for Nexus

This folder contains generated typescript bindings for Nexus.

To update the bindings:

1. Update openapi.json based on
   - <https://nexus.oasis.io/v1/spec/v1.html>

2. Generate the bindings:

   ```sh
   npx @openapitools/openapi-generator-cli generate \
    -i openapi.json \
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
    -i openapi.json \
    -g typescript-fetch \
    -o . \
    --additional-properties=modelPropertyNaming=original,typescriptThreePlus=true
   ```

3. Lint:

   ```sh
   yarn lint:fix
   ```
