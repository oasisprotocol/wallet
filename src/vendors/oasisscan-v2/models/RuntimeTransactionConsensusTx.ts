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
 * @interface RuntimeTransactionConsensusTx
 */
export interface RuntimeTransactionConsensusTx {
    /**
     * 
     * @type {string}
     * @memberof RuntimeTransactionConsensusTx
     */
    method: string;
    /**
     * 
     * @type {string}
     * @memberof RuntimeTransactionConsensusTx
     */
    from: string;
    /**
     * 
     * @type {string}
     * @memberof RuntimeTransactionConsensusTx
     */
    to: string;
    /**
     * 
     * @type {string}
     * @memberof RuntimeTransactionConsensusTx
     */
    amount: string;
    /**
     * 
     * @type {number}
     * @memberof RuntimeTransactionConsensusTx
     */
    nonce: number;
}

export function RuntimeTransactionConsensusTxFromJSON(json: any): RuntimeTransactionConsensusTx {
    return RuntimeTransactionConsensusTxFromJSONTyped(json, false);
}

export function RuntimeTransactionConsensusTxFromJSONTyped(json: any, ignoreDiscriminator: boolean): RuntimeTransactionConsensusTx {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'method': json['method'],
        'from': json['from'],
        'to': json['to'],
        'amount': json['amount'],
        'nonce': json['nonce'],
    };
}

export function RuntimeTransactionConsensusTxToJSON(value?: RuntimeTransactionConsensusTx | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'method': value.method,
        'from': value.from,
        'to': value.to,
        'amount': value.amount,
        'nonce': value.nonce,
    };
}


