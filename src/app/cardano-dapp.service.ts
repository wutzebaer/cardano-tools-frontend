import { Injectable } from '@angular/core';
import {
  DappWallet,
  WalletConnectService,
  WalletConnection,
} from './wallet-connect.service';
import {
  Address,
  AssetName,
  BaseAddress,
  BigNum,
  Ed25519KeyHash,
  NativeScript,
  NativeScripts,
  ScriptAll,
  ScriptAny,
  ScriptHash,
  ScriptPubkey,
  TimelockExpiry,
  TimelockStart,
  Transaction,
  TransactionUnspentOutput,
} from '@emurgo/cardano-serialization-lib-browser';
import { CardanoUtils } from './cardano-utils';
import { hasUncaughtExceptionCaptureCallback } from 'process';

export interface MultiAssetOutput {
  policy_id: ScriptHash;
  asset_name: AssetName;
  value: BigNum;
}

@Injectable({
  providedIn: 'root',
})
export class CardanoDappService {
  constructor() {}

  combineMultiAssetOutputs(
    multiAssetOutputs: MultiAssetOutput[]
  ): MultiAssetOutput[] {
    const groupedMultiAssetOutputs = multiAssetOutputs.reduce(
      (acc, { policy_id, asset_name, value }) => {
        const key = policy_id.to_hex() + '|' + asset_name.to_hex();
        if (!acc[key]) {
          acc[key] = { policy_id, asset_name, value };
        } else {
          acc[key].value = acc[key].value.checked_add(value);
        }
        return acc;
      },
      {} as Record<string, MultiAssetOutput>
    );
    return Object.values(groupedMultiAssetOutputs);
  }

  getMultiAssetOutputs(utxo: TransactionUnspentOutput): MultiAssetOutput[] {
    const result: MultiAssetOutput[] = [];
    const multiAssetMap = utxo.output().amount().multiasset();
    if (multiAssetMap) {
      const scriptHashes = multiAssetMap.keys();
      for (
        let scriptHashIndex = 0;
        scriptHashIndex < scriptHashes.len();
        scriptHashIndex++
      ) {
        const scriptHash = scriptHashes.get(scriptHashIndex);
        const multiAssets = multiAssetMap.get(scriptHash);
        const multiAssetNames = multiAssets?.keys();
        if (multiAssetNames) {
          for (
            let multiAssetIndex = 0;
            multiAssetIndex < multiAssetNames.len();
            multiAssetIndex++
          ) {
            const multiAssetName = multiAssetNames.get(multiAssetIndex);
            const multiAsset = multiAssets?.get(multiAssetName);
            if (multiAsset)
              result.push({
                asset_name: multiAssetName,
                policy_id: scriptHash,
                value: multiAsset,
              });
          }
        }
      }
    }
    return result;
  }
}
