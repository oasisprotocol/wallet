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
/**
 * 
 * @export
 * @interface InlineResponse400
 */
export interface InlineResponse400 {
    /**
     * An error message.
     * @type {string}
     * @memberof InlineResponse400
     */
    msg: string;
}

export function InlineResponse400FromJSON(json: any): InlineResponse400 {
    return InlineResponse400FromJSONTyped(json, false);
}

export function InlineResponse400FromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse400 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'msg': json['msg'],
    };
}

export function InlineResponse400ToJSON(value?: InlineResponse400 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'msg': value.msg,
    };
}


