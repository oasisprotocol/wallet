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
    AccountStats,
    AccountStatsFromJSON,
    AccountStatsFromJSONTyped,
    AccountStatsToJSON,
    Allowance,
    AllowanceFromJSON,
    AllowanceFromJSONTyped,
    AllowanceToJSON,
} from './';

/**
 * A consensus layer account.
 * @export
 * @interface Account
 */
export interface Account {
    /**
     * The staking address for this account.
     * @type {string}
     * @memberof Account
     */
    address: string;
    /**
     * The expected nonce for the next transaction (= last used nonce + 1)
     * @type {number}
     * @memberof Account
     */
    nonce: number;
    /**
     * The available balance, in base units.
     * @type {string}
     * @memberof Account
     */
    available: string;
    /**
     * The active escrow balance, in base units.
     * @type {string}
     * @memberof Account
     */
    escrow: string;
    /**
     * The debonding escrow balance, in base units.
     * @type {string}
     * @memberof Account
     */
    debonding: string;
    /**
     * The balance of this accounts' (outgoing) delegations, in base units.
     * @type {string}
     * @memberof Account
     */
    delegations_balance: string;
    /**
     * The balance of this accounts' (outgoing) debonding delegations, in base units.
     * @type {string}
     * @memberof Account
     */
    debonding_delegations_balance: string;
    /**
     * The second-granular consensus time of the block in which this account was first active.
     * Dates before Cobalt (2021-04-28) are approximate.
     * @type {Date}
     * @memberof Account
     */
    first_activity?: Date;
    /**
     * The allowances made by this account.
     * This field is omitted when listing multiple accounts.
     * @type {Array<Allowance>}
     * @memberof Account
     */
    allowances: Array<Allowance>;
    /**
     * 
     * @type {AccountStats}
     * @memberof Account
     */
    stats: AccountStats;
}

export function AccountFromJSON(json: any): Account {
    return AccountFromJSONTyped(json, false);
}

export function AccountFromJSONTyped(json: any, ignoreDiscriminator: boolean): Account {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'address': json['address'],
        'nonce': json['nonce'],
        'available': json['available'],
        'escrow': json['escrow'],
        'debonding': json['debonding'],
        'delegations_balance': json['delegations_balance'],
        'debonding_delegations_balance': json['debonding_delegations_balance'],
        'first_activity': !exists(json, 'first_activity') ? undefined : (new Date(json['first_activity'])),
        'allowances': ((json['allowances'] as Array<any>).map(AllowanceFromJSON)),
        'stats': AccountStatsFromJSON(json['stats']),
    };
}

export function AccountToJSON(value?: Account | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'address': value.address,
        'nonce': value.nonce,
        'available': value.available,
        'escrow': value.escrow,
        'debonding': value.debonding,
        'delegations_balance': value.delegations_balance,
        'debonding_delegations_balance': value.debonding_delegations_balance,
        'first_activity': value.first_activity === undefined ? undefined : (value.first_activity.toISOString()),
        'allowances': ((value.allowances as Array<any>).map(AllowanceToJSON)),
        'stats': AccountStatsToJSON(value.stats),
    };
}


