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
    EvmTokenType,
    EvmTokenTypeFromJSON,
    EvmTokenTypeFromJSONTyped,
    EvmTokenTypeToJSON,
} from './';

/**
 * Details about the EVM token involved in the event, if any.
 * @export
 * @interface EvmEventToken
 */
export interface EvmEventToken {
    /**
     * 
     * @type {EvmTokenType}
     * @memberof EvmEventToken
     */
    type?: EvmTokenType;
    /**
     * Symbol of the token, as provided by token contract's `symbol()` method.
     * @type {string}
     * @memberof EvmEventToken
     */
    symbol?: string;
    /**
     * The number of least significant digits in base units that should be displayed as
     * decimals when displaying tokens. `tokens = base_units / (10**decimals)`.
     * Affects display only. Often equals 18, to match ETH.
     * @type {number}
     * @memberof EvmEventToken
     */
    decimals?: number;
}

export function EvmEventTokenFromJSON(json: any): EvmEventToken {
    return EvmEventTokenFromJSONTyped(json, false);
}

export function EvmEventTokenFromJSONTyped(json: any, ignoreDiscriminator: boolean): EvmEventToken {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': !exists(json, 'type') ? undefined : EvmTokenTypeFromJSON(json['type']),
        'symbol': !exists(json, 'symbol') ? undefined : json['symbol'],
        'decimals': !exists(json, 'decimals') ? undefined : json['decimals'],
    };
}

export function EvmEventTokenToJSON(value?: EvmEventToken | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': EvmTokenTypeToJSON(value.type),
        'symbol': value.symbol,
        'decimals': value.decimals,
    };
}


