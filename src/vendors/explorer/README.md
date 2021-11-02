# Typescript bindings for Oasis Explorer

This folder contains generated typescript bindings for OasisExplorer.

To update the bindings:

1. Download a fresh version of swagger.yml:

    ```sh
    wget <https://raw.githubusercontent.com/everstake/oasis-explorer/master/swagger/swagger.yml>
    ```

2. Generate the bindings:

    ```sh
    npx @openapitools/openapi-generator-cli generate -i swagger.yml -g typescript-fetch -o . --additional-properties=modelPropertyNaming=snake_case,typescriptThreePlus=true
    ```

3. Workaround for openapi-generator bug [#10164](https://github.com/OpenAPITools/openapi-generator/issues/10164).
    Around line 152 in the generated `runtime.ts` file inside the `Configuration.fetchApi()` function
    replace

    ```typescript
    return this.configuration.fetchApi;
    ```

    with

    ```typescript
    return this.configuration.fetchApi || window.fetch.bind(window);
    ```
