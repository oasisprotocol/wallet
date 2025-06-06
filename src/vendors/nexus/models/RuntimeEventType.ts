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

/**
 * 
 * @export
 * @enum {string}
 */
export enum RuntimeEventType {
    AccountsTransfer = 'accounts.transfer',
    AccountsBurn = 'accounts.burn',
    AccountsMint = 'accounts.mint',
    ConsensusAccountsDeposit = 'consensus_accounts.deposit',
    ConsensusAccountsWithdraw = 'consensus_accounts.withdraw',
    ConsensusAccountsDelegate = 'consensus_accounts.delegate',
    ConsensusAccountsUndelegateStart = 'consensus_accounts.undelegate_start',
    ConsensusAccountsUndelegateDone = 'consensus_accounts.undelegate_done',
    CoreGasUsed = 'core.gas_used',
    EvmLog = 'evm.log',
    RoflAppCreated = 'rofl.app_created',
    RoflAppUpdated = 'rofl.app_updated',
    RoflAppRemoved = 'rofl.app_removed'
}

export function RuntimeEventTypeFromJSON(json: any): RuntimeEventType {
    return RuntimeEventTypeFromJSONTyped(json, false);
}

export function RuntimeEventTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): RuntimeEventType {
    return json as RuntimeEventType;
}

export function RuntimeEventTypeToJSON(value?: RuntimeEventType | null): any {
    return value as any;
}

