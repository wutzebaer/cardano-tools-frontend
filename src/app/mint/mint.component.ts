import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { RestInterfaceService, TransferAccount } from 'src/cardano-tools-client';
import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper!: MatStepper;

  account: TransferAccount = { key: "", address: "", balance: 0, fundingAddresses: [] };

  mintOrderSubmission: MintOrderSubmission = { tokens: [], targetAddress: "", changeAction: 'RETURN', fee: 0 };

  constructor(private api: RestInterfaceService, private localStorageService: LocalStorageService) {
    let accountKey = this.localStorageService.retrieveAccountKey();
    let accountObservable;
    if (accountKey == null) { accountObservable = this.api.createAccount(); }
    else { accountObservable = this.api.getAccount(accountKey); }
    accountObservable.subscribe(account => {
      this.localStorageService.storeAccountKey(account.key)
      this.account = account
      this.mintOrderSubmission.targetAddress = account.fundingAddresses[0];
    })
  }

  ngOnInit(): void {
    this.addToken();
  }

  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      if (event.selectedIndex == 0) {
      } else if (event.selectedIndex == 1) {
        this.api.calculateFee(this.mintOrderSubmission, this.account.key).subscribe(fee => {
          this.mintOrderSubmission.fee = fee
        })
      }
    });
  }

  addToken() {
    let token = { assetName: "", amount: 1, metaData: {} };
    this.mintOrderSubmission.tokens.push(token);
  }

  removeToken(index: number) {
    this.mintOrderSubmission.tokens.splice(index, 1);
  }

}
