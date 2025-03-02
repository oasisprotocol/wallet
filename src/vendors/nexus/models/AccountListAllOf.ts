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
    Account,
    AccountFromJSON,
    AccountFromJSONTyped,
    AccountToJSON,
} from './';

/**
 * A list of consensus layer accounts.
 * @export
 * @interface AccountListAllOf
 */
export interface AccountListAllOf {
    /**
     * 
     * @type {Array<Account>}
     * @memberof AccountListAllOf
     */
    accounts: Array<Account>;
}

export function AccountListAllOfFromJSON(json: any): AccountListAllOf {
    return AccountListAllOfFromJSONTyped(json, false);
}

export function AccountListAllOfFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccountListAllOf {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'accounts': ((json['accounts'] as Array<any>).map(AccountFromJSON)),
    };
}

export function AccountListAllOfToJSON(value?: AccountListAllOf | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'accounts': ((value.accounts as Array<any>).map(AccountToJSON)),
    };
}


