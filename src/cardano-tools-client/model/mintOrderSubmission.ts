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
import { TokenSubmission } from './tokenSubmission';

export interface MintOrderSubmission { 
    tokens: Array<TokenSubmission>;
    targetAddress?: string;
    pin: boolean;
    policyId: string;
    metaData?: string;
}