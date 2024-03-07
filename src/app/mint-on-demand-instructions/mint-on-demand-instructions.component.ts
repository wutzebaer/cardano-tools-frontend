import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  DropRestInterfaceService,
  PublicDropInfo,
} from 'src/cardano-tools-client';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardanoDappService } from '../cardano-dapp.service';
import { Address, BigNum } from '@emurgo/cardano-serialization-lib-browser';
import { ErrorService } from '../error.service';
import { CardanoUtils } from '../cardano-utils';

@Component({
  selector: 'app-mint-on-demand-instructions',
  templateUrl: './mint-on-demand-instructions.component.html',
  styleUrls: ['./mint-on-demand-instructions.component.scss'],
})
export class MintOnDemandInstructionsComponent implements OnInit {
  publicDropInfo?: PublicDropInfo;
  amount: number = 1;
  availableAmounts: number[] = [];
  minting = false;

  constructor(
    private route: ActivatedRoute,
    private dropRestInterfaceService: DropRestInterfaceService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private cardanoDappService: CardanoDappService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.dropRestInterfaceService
        .getDrop(params.prettyUrl)
        .subscribe((publicDropInfo) => {
          this.publicDropInfo = publicDropInfo;
          this.availableAmounts = [];
          for (let index = 1; index <= publicDropInfo.max; index++) {
            this.availableAmounts.push(index);
          }
        });
    });
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    let snackBarRef = this.snackBar.open(
      'Copied to clipboard: ' + value,
      undefined,
      { duration: 2000 }
    );
  }

  async pay() {
    if (!this.publicDropInfo) {
      return;
    }

    try {
      this.minting = true;
      const txId = await this.cardanoDappService.sendAda(
        Address.from_bech32(this.publicDropInfo.address),
        BigNum.from_str((this.publicDropInfo.price * this.amount).toString())
      );

      await this.dropRestInterfaceService
        .initMintingStatus({
          paymentTxId: txId,
          status: 'Waiting for payment confirmation...',
          validUntilSlot: CardanoUtils.currentSlot() + 60 * 10,
          txId: txId,
          finished: false,
          finalStep: false,
        })
        .toPromise();
    } catch (error) {
      this.errorService.handleError(error);
    } finally {
      this.minting = false;
    }
  }
}
