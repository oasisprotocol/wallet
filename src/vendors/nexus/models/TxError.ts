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
    EvmAbiParam,
    EvmAbiParamFromJSON,
    EvmAbiParamFromJSONTyped,
    EvmAbiParamToJSON,
} from './';

/**
 * 
 * @export
 * @interface TxError
 */
export interface TxError {
    /**
     * The module of a failed transaction.
     * @type {string}
     * @memberof TxError
     */
    module?: string;
    /**
     * The status code of a failed transaction.
     * @type {number}
     * @memberof TxError
     */
    code: number;
    /**
     * The message of a failed transaction.
     * This field, like `code` and `module`, can represent an error that originated
     * anywhere in the paratime, i.e. either inside or outside a smart contract.
     * 
     * A common special case worth calling out: When the paratime is
     * EVM-compatible (e.g. Emerald or Sapphire) and the error originates
     * inside a smart contract (using `revert` in solidity), the following
     * will be true:
     * - `module` will be "evm" and `code` will be 8; see [here](https://github.com/oasisprotocol/oasis-sdk/blob/runtime-sdk/v0.8.3/runtime-sdk/modules/evm/src/lib.rs#L128) for other possible errors in the `evm` module.
     * - `message` will contain the best-effort human-readable revert reason.
     * @type {string}
     * @memberof TxError
     */
    message?: string;
    /**
     * The error parameters, as decoded using the contract abi. Present only when
     * - the error originated from within a smart contract (e.g. via `revert` in Solidity), and
     * - the contract is verified or the revert reason is a plain String.
     * If this field is present, `message` will include the name of the error, e.g. 'InsufficientBalance'.
     * Note that users should be cautious when evaluating error data since the
     * data origin is not tracked and error information can be faked.
     * @type {Array<EvmAbiParam>}
     * @memberof TxError
     */
    revert_params?: Array<EvmAbiParam>;
}

export function TxErrorFromJSON(json: any): TxError {
    return TxErrorFromJSONTyped(json, false);
}

export function TxErrorFromJSONTyped(json: any, ignoreDiscriminator: boolean): TxError {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'module': !exists(json, 'module') ? undefined : json['module'],
        'code': json['code'],
        'message': !exists(json, 'message') ? undefined : json['message'],
        'revert_params': !exists(json, 'revert_params') ? undefined : ((json['revert_params'] as Array<any>).map(EvmAbiParamFromJSON)),
    };
}

export function TxErrorToJSON(value?: TxError | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'module': value.module,
        'code': value.code,
        'message': value.message,
        'revert_params': value.revert_params === undefined ? undefined : ((value.revert_params as Array<any>).map(EvmAbiParamToJSON)),
    };
}


