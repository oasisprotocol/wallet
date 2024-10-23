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
 * @interface ChainBlockInfo
 */
export interface ChainBlockInfo {
    /**
     * 
     * @type {number}
     * @memberof ChainBlockInfo
     */
    height: number;
    /**
     * 
     * @type {number}
     * @memberof ChainBlockInfo
     */
    epoch: number;
    /**
     * 
     * @type {number}
     * @memberof ChainBlockInfo
     */
    timestamp: number;
    /**
     * 
     * @type {number}
     * @memberof ChainBlockInfo
     */
    time: number;
    /**
     * 
     * @type {string}
     * @memberof ChainBlockInfo
     */
    hash: string;
    /**
     * 
     * @type {number}
     * @memberof ChainBlockInfo
     */
    txs: number;
    /**
     * 
     * @type {string}
     * @memberof ChainBlockInfo
     */
    entityAddress: string;
    /**
     * 
     * @type {string}
     * @memberof ChainBlockInfo
     */
    name: string;
}

export function ChainBlockInfoFromJSON(json: any): ChainBlockInfo {
    return ChainBlockInfoFromJSONTyped(json, false);
}

export function ChainBlockInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChainBlockInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'height': json['height'],
        'epoch': json['epoch'],
        'timestamp': json['timestamp'],
        'time': json['time'],
        'hash': json['hash'],
        'txs': json['txs'],
        'entityAddress': json['entityAddress'],
        'name': json['name'],
    };
}

export function ChainBlockInfoToJSON(value?: ChainBlockInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'height': value.height,
        'epoch': value.epoch,
        'timestamp': value.timestamp,
        'time': value.time,
        'hash': value.hash,
        'txs': value.txs,
        'entityAddress': value.entityAddress,
        'name': value.name,
    };
}

