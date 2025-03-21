/* tslint:disable */
/* eslint-disable */
/**
 * 
 * This api document example is the Mainnet document, and the Testnet base URL is api.oasisscan.com/v2/testnet
 *
 * The version of the OpenAPI document: 
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface RuntimeRoundInfoRequest
 */
export interface RuntimeRoundInfoRequest {
    /**
     * 
     * @type {string}
     * @memberof RuntimeRoundInfoRequest
     */
    id: string;
    /**
     * 
     * @type {number}
     * @memberof RuntimeRoundInfoRequest
     */
    round: number;
}

export function RuntimeRoundInfoRequestFromJSON(json: any): RuntimeRoundInfoRequest {
    return RuntimeRoundInfoRequestFromJSONTyped(json, false);
}

export function RuntimeRoundInfoRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): RuntimeRoundInfoRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'round': json['round'],
    };
}

export function RuntimeRoundInfoRequestToJSON(value?: RuntimeRoundInfoRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'round': value.round,
    };
}


