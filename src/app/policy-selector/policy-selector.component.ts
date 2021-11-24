import { distinctUntilChanged } from 'rxjs/operators';
import { MintPolicyFormComponent } from 'src/app/mint-policy-form/mint-policy-form.component';
import { CardanoUtils } from './../cardano-utils';
import { LocalStorageService } from './../local-storage.service';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { Account, Policy } from 'src/cardano-tools-client';
import { AccountService } from './../account.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-policy-selector',
  templateUrl: './policy-selector.component.html',
  styleUrls: ['./policy-selector.component.scss']
})
export class PolicySelectorComponent implements AfterViewInit {

  @Input() disabled = true;
  @Output() changedPolicyId = new EventEmitter<string>();
  account?: Account;
  selectedPolicyId?: string | null;

  constructor(private accountService: AccountService, private localStorageService: LocalStorageService, private dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.accountService.account.subscribe(newAccount => {

      if (!newAccount.policies.length) {
        return;
      }

      const oldPolicyId = this.selectedPolicyId;

      if (!this.selectedPolicyId) {
        this.selectedPolicyId = this.localStorageService.retrievePolicyId();
      }

      if (!newAccount.policies.find(p => p.policyId === this.selectedPolicyId)) {
        this.selectedPolicyId = this.findUnlockedPolicy(newAccount).policyId;
      }

      if (this.getTimeLeft(newAccount.policies.find(p => p.policyId === this.selectedPolicyId)!) === 0) {
        this.selectedPolicyId = this.findUnlockedPolicy(newAccount).policyId;
      }

      if (this.selectedPolicyId != oldPolicyId) {
        this.policyChanged();
      }

      this.account = newAccount;
    });

  }

  findUnlockedPolicy(account: Account): Policy {
    return account.policies.find(p => this.getTimeLeft(p) > 0)!;
  }



  policyChanged($event?: MatSelectChange) {
    if (this.selectedPolicyId === 'CREATE_NEW') {
      const dialogRef = this.dialog.open(MintPolicyFormComponent, {
        width: '800px',
        maxWidth: '90vw',
        closeOnNavigation: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.selectedPolicyId = this.localStorageService.retrievePolicyId();
        }
      });
    } else {
      this.localStorageService.storePolicyId(this.selectedPolicyId!);
      this.changedPolicyId.next(this.selectedPolicyId!);
    }
  }

  getTimeLeft(policy: Policy): number {
    return CardanoUtils.getTimeLeft(policy);
  }

  getTimeLeftString(policy: Policy): string {
    return CardanoUtils.getTimeLeftString(policy);
  }

}
