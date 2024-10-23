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
    ProposalVote,
    ProposalVoteFromJSON,
    ProposalVoteFromJSONTyped,
    ProposalVoteToJSON,
} from './';

/**
 * A list of votes for a governance proposal.
 * @export
 * @interface ProposalVotesAllOf
 */
export interface ProposalVotesAllOf {
    /**
     * The unique identifier of the proposal.
     * @type {number}
     * @memberof ProposalVotesAllOf
     */
    proposal_id: number;
    /**
     * The list of votes for the proposal.
     * @type {Array<ProposalVote>}
     * @memberof ProposalVotesAllOf
     */
    votes: Array<ProposalVote>;
}

export function ProposalVotesAllOfFromJSON(json: any): ProposalVotesAllOf {
    return ProposalVotesAllOfFromJSONTyped(json, false);
}

export function ProposalVotesAllOfFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProposalVotesAllOf {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'proposal_id': json['proposal_id'],
        'votes': ((json['votes'] as Array<any>).map(ProposalVoteFromJSON)),
    };
}

export function ProposalVotesAllOfToJSON(value?: ProposalVotesAllOf | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'proposal_id': value.proposal_id,
        'votes': ((value.votes as Array<any>).map(ProposalVoteToJSON)),
    };
}

