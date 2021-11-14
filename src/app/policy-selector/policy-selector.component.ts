import { MintPolicyFormComponent } from 'src/app/mint-policy-form/mint-policy-form.component';
import { CardanoUtils } from './../cardano-utils';
import { LocalStorageService } from './../local-storage.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account, Policy } from 'src/cardano-tools-client';
import { AccountService } from './../account.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-policy-selector',
  templateUrl: './policy-selector.component.html',
  styleUrls: ['./policy-selector.component.scss']
})
export class PolicySelectorComponent implements OnInit {

  @Input() disabled = true;
  @Output() changedPolicyId = new EventEmitter<string>();
  account?: Account;
  selectedPolicyId?: string | null;

  constructor(accountService: AccountService, private localStorageService: LocalStorageService, private dialog: MatDialog) {
    this.selectedPolicyId = localStorageService.retrievePolicyId();
    accountService.account.subscribe(newAccount => {
      console.log
      if (
        newAccount.policies.length && !this.selectedPolicyId
        || newAccount.policies.length && (this.getTimeLeft(newAccount.policies.find(p => p.policyId === this.selectedPolicyId)!) === 0)
        || this.account?.policies.length && this.account.policies.length != newAccount.policies.length
      ) {
        this.selectedPolicyId = this.findUnlockedPolicy(newAccount).policyId;
      }
      this.account = newAccount;
      this.policyChanged();
    });
  }

  findUnlockedPolicy(account: Account): Policy {
    return account.policies.find(p => this.getTimeLeft(p) > 0)!;
  }

  ngOnInit(): void {
  }

  policyChanged($event?: MatSelectChange) {
    if (!this.selectedPolicyId) {
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
