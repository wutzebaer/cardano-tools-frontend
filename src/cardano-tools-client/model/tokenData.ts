/**
 * OpenAPI definition
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface TokenData { 
    policyId: string;
    name: string;
    quantity: number;
    txId: string;
    json: string;
    invalidBefore?: number;
    invalidHereafter?: number;
    blockNo: number;
    epochNo: number;
    epochSlotNo: number;
    tid: number;
    mintid: number;
    tokenRegistryMetadata?: string;
    fingerprint: string;
    subject: string;
}