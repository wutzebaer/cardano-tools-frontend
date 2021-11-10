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
import { MintOrderSubmission } from './mintOrderSubmission';

export interface Transaction { 
    signedData: string;
    rawData: string;
    txId: string;
    fee: number;
    minOutput?: number;
    txSize: number;
    outputs: string;
    inputs: string;
    metaDataJson?: string;
    mintOrderSubmission?: MintOrderSubmission;
}