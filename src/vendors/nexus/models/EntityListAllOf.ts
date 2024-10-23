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
import {
    Entity,
    EntityFromJSON,
    EntityFromJSONTyped,
    EntityToJSON,
} from './';

/**
 * A list of entities registered at the consensus layer.
 * @export
 * @interface EntityListAllOf
 */
export interface EntityListAllOf {
    /**
     * 
     * @type {Array<Entity>}
     * @memberof EntityListAllOf
     */
    entities: Array<Entity>;
}

export function EntityListAllOfFromJSON(json: any): EntityListAllOf {
    return EntityListAllOfFromJSONTyped(json, false);
}

export function EntityListAllOfFromJSONTyped(json: any, ignoreDiscriminator: boolean): EntityListAllOf {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'entities': ((json['entities'] as Array<any>).map(EntityFromJSON)),
    };
}

export function EntityListAllOfToJSON(value?: EntityListAllOf | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'entities': ((value.entities as Array<any>).map(EntityToJSON)),
    };
}

