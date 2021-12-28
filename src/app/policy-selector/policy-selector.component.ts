import { distinctUntilChanged } from 'rxjs/operators';
import { MintPolicyFormComponent } from 'src/app/mint-policy-form/mint-policy-form.component';
import { CardanoUtils } from './../cardano-utils';
import { LocalStorageService } from './../local-storage.service';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { AccountService } from './../account.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { I } from '@angular/cdk/keycodes';
import { AccountPrivate, PolicyPrivate } from 'src/cardano-tools-client';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-policy-selector',
  templateUrl: './policy-selector.component.html',
  styleUrls: ['./policy-selector.component.scss']
})
export class PolicySelectorComponent implements AfterViewInit {

  @Input() disabled = false;
  @Input() createPolicies = true;
  @Output() changedPolicyId = new EventEmitter<string>();
  account?: AccountPrivate;
  selectedPolicyId?: string | null;
  timer: Subscription;

  constructor(private accountService: AccountService, private localStorageService: LocalStorageService, private dialog: MatDialog) {
    this.selectedPolicyId = this.localStorageService.retrievePolicyId();
    // updates time
    this.timer = interval(1000).subscribe(() => {
    });
  }

  ngAfterViewInit() {
    this.accountService.account.subscribe(newAccount => {
      const oldPolicyId = this.selectedPolicyId;

      // policyid from localStorage is invalid
      if (!newAccount.policies.find(p => p.policyId === this.selectedPolicyId)) {
        this.selectedPolicyId = this.findUnlockedPolicy(newAccount).policyId;
      }

      // policyid from localStorage is closed
      if (this.getTimeLeft(newAccount.policies.find(p => p.policyId === this.selectedPolicyId)!) === 0) {
        this.selectedPolicyId = this.findUnlockedPolicy(newAccount).policyId;
      }

      // publish policy id
      if (!this.account || this.selectedPolicyId != oldPolicyId) {
        this.policyChanged();
      }

      this.account = newAccount;

    });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  findUnlockedPolicy(account: AccountPrivate): PolicyPrivate {
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

  getTimeLeft(policy: PolicyPrivate): number {
    return CardanoUtils.getTimeLeft(policy);
  }

  getTimeLeftString(policy: PolicyPrivate): string {
    return CardanoUtils.getTimeLeftString(policy);
  }

}
