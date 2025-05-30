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
import {
    GovernanceProposalInfo,
    GovernanceProposalInfoFromJSON,
    GovernanceProposalInfoFromJSONTyped,
    GovernanceProposalInfoToJSON,
} from './';

/**
 * 
 * @export
 * @interface GovernanceProposalListResponse
 */
export interface GovernanceProposalListResponse {
    /**
     * 
     * @type {Array<GovernanceProposalInfo>}
     * @memberof GovernanceProposalListResponse
     */
    list: Array<GovernanceProposalInfo>;
}

export function GovernanceProposalListResponseFromJSON(json: any): GovernanceProposalListResponse {
    return GovernanceProposalListResponseFromJSONTyped(json, false);
}

export function GovernanceProposalListResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GovernanceProposalListResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'list': ((json['list'] as Array<any>).map(GovernanceProposalInfoFromJSON)),
    };
}

export function GovernanceProposalListResponseToJSON(value?: GovernanceProposalListResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'list': ((value.list as Array<any>).map(GovernanceProposalInfoToJSON)),
    };
}


