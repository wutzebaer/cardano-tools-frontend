/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { TokenSubmission } from './tokenSubmission';

export interface MintOrderSubmission {
  tokens: Array<TokenSubmission>;
  targetAddress: string;
  pin: boolean;
  policyId: string;
  metaData?: string;
}
