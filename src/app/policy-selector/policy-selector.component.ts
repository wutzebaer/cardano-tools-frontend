import { distinctUntilChanged } from 'rxjs/operators';
import { MintPolicyFormComponent } from 'src/app/mint-policy-form/mint-policy-form.component';
import { CardanoUtils } from './../cardano-utils';
import { LocalStorageService } from './../local-storage.service';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, OnDestroy } from '@angular/core';
import { AccountService } from './../account.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { I } from '@angular/cdk/keycodes';
import { interval, Subscription } from 'rxjs';
import { PolicyPrivate } from 'src/cardano-tools-client';

@Component({
  selector: 'app-policy-selector',
  templateUrl: './policy-selector.component.html',
  styleUrls: ['./policy-selector.component.scss']
})
export class PolicySelectorComponent implements AfterViewInit, OnDestroy {

  @Input() disabled = false;
  @Input() createPolicies = true;
  @Output() changedPolicyId = new EventEmitter<string>();
  policies?: PolicyPrivate[];
  selectedPolicyId?: string | null;
  timer: Subscription;
  policiesSubscription!: Subscription

  constructor(private accountService: AccountService, private localStorageService: LocalStorageService, private dialog: MatDialog) {
    this.selectedPolicyId = this.localStorageService.retrievePolicyId();
    this.policiesSubscription = accountService.policies.subscribe(policies => {
      this.policies = policies;

      const oldPolicyId = this.selectedPolicyId;

      // policyid from localStorage is invalid
      if (!policies.find(p => p.policyId === this.selectedPolicyId)) {
        this.selectedPolicyId = this.findUnlockedPolicy(policies).policyId;
      }

      // policyid from localStorage is closed
      if (this.getTimeLeft(policies.find(p => p.policyId === this.selectedPolicyId)!) === 0) {
        this.selectedPolicyId = this.findUnlockedPolicy(policies).policyId;
      }

      // publish policy id
      if (!this.policies || this.selectedPolicyId != oldPolicyId) {
        this.policyChanged();
      }

    });
    // updates time
    this.timer = interval(1000).subscribe(() => {
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
    this.policiesSubscription.unsubscribe();
  }

  findUnlockedPolicy(policies: PolicyPrivate[]): PolicyPrivate {
    return policies.find(p => this.getTimeLeft(p) > 0)!;
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
