/* tslint:disable */
/* eslint-disable */
/**
 * Oasis Nexus API V1
 * An API for accessing indexed data from the Oasis Network.  <!-- Acts as a separator after search in sidebar --> # Endpoints 
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * Light-weight entity information, containing only its ID, address and registry metadata.
 * @export
 * @interface EntityInfo
 */
export interface EntityInfo {
    /**
     * The ID of the entity owning the node; this corresponds to the entity's public key in base64.
     * @type {string}
     * @memberof EntityInfo
     */
    entity_id?: string;
    /**
     * Address of the entity owning the node, in Bech32 format (`oasis1...`).
     * @type {string}
     * @memberof EntityInfo
     */
    entity_address?: string;
    /**
     * Metadata about an entity, if available. See [the metadata registry](https://github.com/oasisprotocol/metadata-registry) for details.
     * 
     * When available, it is an object with some subset of the following fields:
     * 
     * - `v`: The version of the metadata structure (always present).
     * - `serial`: The serial number of the metadata statement (always present).
     * - `name`: The name of the entity.
     * - `url`: The URL associated with the entity.
     * - `email`: The email address associated with the entity.
     * - `keybase`: Tne entity's keybase.io handle.
     * - `twitter`: The twitter handle associated with the entity.
     * @type {any}
     * @memberof EntityInfo
     */
    entity_metadata?: any | null;
}

export function EntityInfoFromJSON(json: any): EntityInfo {
    return EntityInfoFromJSONTyped(json, false);
}

export function EntityInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): EntityInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'entity_id': !exists(json, 'entity_id') ? undefined : json['entity_id'],
        'entity_address': !exists(json, 'entity_address') ? undefined : json['entity_address'],
        'entity_metadata': !exists(json, 'entity_metadata') ? undefined : json['entity_metadata'],
    };
}

export function EntityInfoToJSON(value?: EntityInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'entity_id': value.entity_id,
        'entity_address': value.entity_address,
        'entity_metadata': value.entity_metadata,
    };
}


