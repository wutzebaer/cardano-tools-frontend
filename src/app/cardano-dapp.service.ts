import { Policy } from './../cardano-tools-client/model/policy';
import { MintOrderSubmission } from './../cardano-tools-client/model/mintOrderSubmission';
import { Injectable } from '@angular/core';
import {
  Address,
  AssetName,
  Assets,
  BigNum,
  CoinSelectionStrategyCIP2,
  Ed25519KeyHash,
  Int,
  MultiAsset,
  NativeScript,
  NativeScripts,
  PrivateKey,
  ScriptAll,
  ScriptAny,
  ScriptHash,
  ScriptPubkey,
  TimelockExpiry,
  TimelockStart,
  Transaction,
  TransactionBuilder,
  TransactionOutput,
  TransactionOutputBuilder,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  TransactionWitnessSet,
  Value,
  hash_transaction,
  make_vkey_witness,
  min_ada_required,
} from '@emurgo/cardano-serialization-lib-browser';
import { CardanoUtils } from './cardano-utils';
import {
  WalletConnectService,
  txBuilderConfig,
} from './wallet-connect.service';
import { PolicyPrivate, TokenSubmission } from 'src/cardano-tools-client';

export interface MultiAssetOutput {
  policy_id: ScriptHash;
  asset_name: AssetName;
  value: BigNum;
}

export interface SimpleScript {
  type: 'all' | 'any' | 'atLeast' | 'before' | 'after' | 'sig';
  scripts?: SimpleScript[];
  required?: number;
  slot?: number;
  keyHash?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CardanoDappService {
  constructor(private walletConnectService: WalletConnectService) {}

  public async sendAda(targetAddress: Address, amount: BigNum) {
    const output = TransactionOutput.new(targetAddress, Value.new(amount));
    const tx = await this.buildTransaction((txBuilder: TransactionBuilder) => {
      txBuilder.add_output(output);
    });
    return await this.submitTransaction(tx);
  }

  public async mintTokens(
    policy: PolicyPrivate,
    tokens: TokenSubmission[],
    metadata: any
  ) {
    const changeAddress = await this.getChangeAddress();
    const nativeScript = this.toNativeScript(JSON.parse(policy.policy));

    const tx = await this.buildTransaction((txBuilder: TransactionBuilder) => {
      const assetsMap = Assets.new();
      for (const token of tokens) {
        const assetName = AssetName.new(Buffer.from(token.assetName));
        assetsMap.insert(assetName, BigNum.from_str(token.amount.toString()));
        txBuilder.add_mint_asset(
          nativeScript,
          assetName,
          Int.new_i32(token.amount)
        );
      }

      const multiAsset = MultiAsset.new();
      multiAsset.insert(nativeScript.hash(), assetsMap);
      const minAda = min_ada_required(
        Value.new_with_assets(BigNum.from_str('100000000'), multiAsset),
        true,
        BigNum.from_str('34482')
      );

      txBuilder.add_output(
        TransactionOutput.new(
          changeAddress,
          Value.new_with_assets(minAda, multiAsset)
        )
      );

      txBuilder.add_json_metadatum(
        BigNum.from_str('721'),
        JSON.stringify(metadata['721'])
      );
    });

    return await this.submitTransaction(tx, policy);
  }

  public async submitTransaction(tx: Transaction, policy?: PolicyPrivate) {
    const wallet = this.walletConnectService.getDappWallet().walletConnector;
    const witnessCbor = await wallet.signTx(tx.to_hex(), true);
    const witnessSet = TransactionWitnessSet.from_hex(witnessCbor);
    const txHash = hash_transaction(tx.body());

    if (policy) {
      const pkeyCbor = JSON.parse(policy.address.skey).cborHex;
      const privateKey = PrivateKey.from_hex(pkeyCbor.substring(4)); // Remove the "5820" prefix
      const witness = make_vkey_witness(txHash, privateKey);
      const vkeys = witnessSet.vkeys()!;
      vkeys.add(witness);
      witnessSet.set_vkeys(vkeys);

      const nativeScripts = NativeScripts.new();
      nativeScripts.add(this.toNativeScript(JSON.parse(policy.policy)));
      witnessSet.set_native_scripts(nativeScripts);
    }

    const signedTx = Transaction.new(
      tx.body(),
      witnessSet,
      tx.auxiliary_data()
    );
    await wallet.submitTx(signedTx.to_hex());

    return txHash.to_hex();
  }

  private toNativeScript(simpleScript: SimpleScript): NativeScript {
    if (simpleScript.type === 'all') {
      const scripts = NativeScripts.new();
      simpleScript.scripts
        ?.map((s) => this.toNativeScript(s))
        .forEach((s) => {
          scripts.add(s);
        });
      return NativeScript.new_script_all(ScriptAll.new(scripts));
    } else if (simpleScript.type === 'any') {
      const scripts = NativeScripts.new();
      simpleScript.scripts
        ?.map((s) => this.toNativeScript(s))
        .forEach((s) => {
          scripts.add(s);
        });
      return NativeScript.new_script_any(ScriptAny.new(scripts));
    } else if (simpleScript.type === 'before') {
      return NativeScript.new_timelock_expiry(
        TimelockExpiry.new(simpleScript.slot!)
      );
    } else if (simpleScript.type === 'after') {
      return NativeScript.new_timelock_start(
        TimelockStart.new_timelockstart(BigNum.from_str(`${simpleScript.slot}`))
      );
    } else if (simpleScript.type === 'sig') {
      return NativeScript.new_script_pubkey(
        ScriptPubkey.new(
          Ed25519KeyHash.from_bytes(
            Buffer.from(`${simpleScript.keyHash}`, 'hex')
          )
        )
      );
    } else {
      throw new Error(`Cannot parse ${simpleScript}`);
    }
  }

  private async getChangeAddress() {
    const wallet = this.walletConnectService.getDappWallet().walletConnector;
    const changeAddress = Address.from_hex(await wallet.getChangeAddress());
    return changeAddress;
  }

  private async buildTransaction(
    addOutputs: (txBuilder: TransactionBuilder) => void
  ) {
    const wallet = this.walletConnectService.getDappWallet().walletConnector;
    const changeAddress = Address.from_bytes(
      Buffer.from(await wallet.getChangeAddress(), 'hex')
    );
    const collateral = wallet.getCollateral
      ? (await wallet.getCollateral()) ?? []
      : [];

    // build TransactionUnspentOutputs
    const rawUtxos = CardanoUtils.shuffleArray(
      (await wallet.getUtxos()).filter((item) => !collateral.includes(item))
    );
    const transactionUnspentOutputs = TransactionUnspentOutputs.new();
    const utxos = rawUtxos
      .map((ru) => {
        return TransactionUnspentOutput.from_bytes(Buffer.from(ru, 'hex'));
      })
      .filter((utxo) => utxo.output().amount().multiasset());
    for (const utxo of utxos) {
      transactionUnspentOutputs.add(utxo);
    }

    let lastError;
    for (let i = 0; i < 100; i++) {
      try {
        const txBuilder = this.walletConnectService.getTxBuilder();

        txBuilder.set_ttl(CardanoUtils.currentSlot() + 60 * 10);

        // add output
        addOutputs(txBuilder);

        txBuilder.add_inputs_from(
          transactionUnspentOutputs,
          CoinSelectionStrategyCIP2.RandomImproveMultiAsset
        );

        txBuilder.add_change_if_needed(changeAddress);

        return txBuilder.build_tx();
      } catch (error) {
        lastError = error;
        console.warn('retry', i, error);
      }
    }
    throw lastError;
  }
}
