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
    EvmToken,
    EvmTokenFromJSON,
    EvmTokenFromJSONTyped,
    EvmTokenToJSON,
} from './';

/**
 * 
 * @export
 * @interface EvmNft
 */
export interface EvmNft {
    /**
     * 
     * @type {EvmToken}
     * @memberof EvmNft
     */
    token: EvmToken;
    /**
     * The instance ID of this NFT within the collection represented by `token`.
     * @type {string}
     * @memberof EvmNft
     */
    id: string;
    /**
     * The Oasis address of this NFT instance's owner.
     * @type {string}
     * @memberof EvmNft
     */
    owner?: string;
    /**
     * The Ethereum address of this NFT instance's owner.
     * @type {string}
     * @memberof EvmNft
     */
    owner_eth?: string;
    /**
     * The total number of transfers of this NFT instance.
     * @type {number}
     * @memberof EvmNft
     */
    num_transfers?: number;
    /**
     * 
     * @type {string}
     * @memberof EvmNft
     */
    metadata_uri?: string;
    /**
     * 
     * @type {string}
     * @memberof EvmNft
     */
    metadata_accessed?: string;
    /**
     * A metadata document for this NFT instance.
     * Currently only ERC-721 is supported, where the document is an Asset Metadata from the ERC721 Metadata JSON Schema.
     * @type {any}
     * @memberof EvmNft
     */
    metadata?: any | null;
    /**
     * Identifies the asset which this NFT represents
     * @type {string}
     * @memberof EvmNft
     */
    name?: string;
    /**
     * Describes the asset which this NFT represents
     * @type {string}
     * @memberof EvmNft
     */
    description?: string;
    /**
     * A URI pointing to a resource with mime type image/* representing
     * the asset which this NFT represents. (Additional
     * non-descriptive text from ERC-721 omitted.)
     * @type {string}
     * @memberof EvmNft
     */
    image?: string;
}

export function EvmNftFromJSON(json: any): EvmNft {
    return EvmNftFromJSONTyped(json, false);
}

export function EvmNftFromJSONTyped(json: any, ignoreDiscriminator: boolean): EvmNft {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'token': EvmTokenFromJSON(json['token']),
        'id': json['id'],
        'owner': !exists(json, 'owner') ? undefined : json['owner'],
        'owner_eth': !exists(json, 'owner_eth') ? undefined : json['owner_eth'],
        'num_transfers': !exists(json, 'num_transfers') ? undefined : json['num_transfers'],
        'metadata_uri': !exists(json, 'metadata_uri') ? undefined : json['metadata_uri'],
        'metadata_accessed': !exists(json, 'metadata_accessed') ? undefined : json['metadata_accessed'],
        'metadata': !exists(json, 'metadata') ? undefined : json['metadata'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'image': !exists(json, 'image') ? undefined : json['image'],
    };
}

export function EvmNftToJSON(value?: EvmNft | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'token': EvmTokenToJSON(value.token),
        'id': value.id,
        'owner': value.owner,
        'owner_eth': value.owner_eth,
        'num_transfers': value.num_transfers,
        'metadata_uri': value.metadata_uri,
        'metadata_accessed': value.metadata_accessed,
        'metadata': value.metadata,
        'name': value.name,
        'description': value.description,
        'image': value.image,
    };
}


