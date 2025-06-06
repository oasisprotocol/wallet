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
 * @interface GovernanceProposalInfo
 */
export interface GovernanceProposalInfo {
    /**
     * 
     * @type {number}
     * @memberof GovernanceProposalInfo
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof GovernanceProposalInfo
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof GovernanceProposalInfo
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof GovernanceProposalInfo
     */
    submitter: string;
    /**
     * 
     * @type {string}
     * @memberof GovernanceProposalInfo
     */
    state: string;
    /**
     * 
     * @type {string}
     * @memberof GovernanceProposalInfo
     */
    deposit: string;
    /**
     * 
     * @type {number}
     * @memberof GovernanceProposalInfo
     */
    created_at: number;
    /**
     * 
     * @type {number}
     * @memberof GovernanceProposalInfo
     */
    closed_at: number;
    /**
     * 
     * @type {number}
     * @memberof GovernanceProposalInfo
     */
    created_time: number;
    /**
     * 
     * @type {number}
     * @memberof GovernanceProposalInfo
     */
    closed_time: number;
}

export function GovernanceProposalInfoFromJSON(json: any): GovernanceProposalInfo {
    return GovernanceProposalInfoFromJSONTyped(json, false);
}

export function GovernanceProposalInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GovernanceProposalInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'title': json['title'],
        'type': json['type'],
        'submitter': json['submitter'],
        'state': json['state'],
        'deposit': json['deposit'],
        'created_at': json['created_at'],
        'closed_at': json['closed_at'],
        'created_time': json['created_time'],
        'closed_time': json['closed_time'],
    };
}

export function GovernanceProposalInfoToJSON(value?: GovernanceProposalInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'title': value.title,
        'type': value.type,
        'submitter': value.submitter,
        'state': value.state,
        'deposit': value.deposit,
        'created_at': value.created_at,
        'closed_at': value.closed_at,
        'created_time': value.created_time,
        'closed_time': value.closed_time,
    };
}


