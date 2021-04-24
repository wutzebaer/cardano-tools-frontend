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

  name: string = "";
  amount: number = 0;
  fee: number | null = null;
  account: TransferAccount | null = null;

  mintOrderSubmission: MintOrderSubmission = { tokens: [], targetAddress: "", changeAction: 'RETURN' };

  constructor(private api: RestInterfaceService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.addToken();
  }

  ngAfterViewInit() {
    let accountKey = this.localStorageService.retrieveAccountKey();
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      if (event.selectedIndex == 0) {
      } else if (event.selectedIndex == 1) {

        this.api.calculateFee(this.mintOrderSubmission).subscribe(fee => {
          this.fee = fee
        })

        let accountObservable;
        if (accountKey == null) { accountObservable = this.api.createAccount(); }
        else { accountObservable = this.api.getAccount(accountKey); }
        accountObservable.subscribe(account => {
          this.localStorageService.storeAccountKey(account.key)
          this.account = account
          this.mintOrderSubmission.targetAddress = account.fundingAddresses[0];
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
