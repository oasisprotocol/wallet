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
 * @interface AccountRewardStatsRequest
 */
export interface AccountRewardStatsRequest {
    /**
     * 
     * @type {string}
     * @memberof AccountRewardStatsRequest
     */
    account: string;
}

export function AccountRewardStatsRequestFromJSON(json: any): AccountRewardStatsRequest {
    return AccountRewardStatsRequestFromJSONTyped(json, false);
}

export function AccountRewardStatsRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccountRewardStatsRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'account': json['account'],
    };
}

export function AccountRewardStatsRequestToJSON(value?: AccountRewardStatsRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'account': value.account,
    };
}


