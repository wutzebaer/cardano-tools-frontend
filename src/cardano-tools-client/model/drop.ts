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
import { Address } from './address';
import { DropNft } from './dropNft';
import { Policy } from './policy';

export interface Drop { 
    id: number;
    policy: Policy;
    address: Address;
    name: string;
    price: number;
    maxPerTransaction: number;
    running: boolean;
    profitAddress: string;
    whitelist: Array<string>;
    dropNfts: Array<DropNft>;
    dropNftsSoldAssetNames: Array<string>;
    dropNftsAvailableAssetNames: Array<string>;
    prettyUrl: string;
    fee: number;
}