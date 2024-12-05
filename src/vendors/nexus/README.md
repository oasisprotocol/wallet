# Typescript bindings for Nexus

This folder contains generated typescript bindings for Nexus.

Validate @openapitools/openapi-generator-cli version:

```
npx @openapitools/openapi-generator-cli version
```

In order to use type mappings make sure to use at least `7.10.0` version.
To bump version use a following command:

```
npx @openapitools/openapi-generator-cli version-manager set 7.10.0
```

You can also use `version-manager`:

```
npx @openapitools/openapi-generator-cli version-manager list
```

To update the bindings:

1. Update openapi.json based on
   - <https://nexus.oasis.io/v1/spec/v1.html>

2. Generate the bindings:

   ```sh
   npx @openapitools/openapi-generator-cli generate \
    -i openapi.json \
    -g typescript-fetch \
    -o . \
    --additional-properties=modelPropertyNaming=original,typescriptThreePlus=true \
    --type-mappings string+date-time=string
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
    --additional-properties=modelPropertyNaming=original,typescriptThreePlus=true \ 
    --type-mappings string+date-time=string
   ```

3. Lint:

   ```sh
   yarn lint:fix
   ```
