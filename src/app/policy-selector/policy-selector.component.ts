import { LocalStorageService } from './../local-storage.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Account, Policy } from 'src/cardano-tools-client';
import { AccountService } from './../account.service';

@Component({
  selector: 'app-policy-selector',
  templateUrl: './policy-selector.component.html',
  styleUrls: ['./policy-selector.component.scss']
})
export class PolicySelectorComponent implements OnInit {

  @Output() changedPolicyId = new EventEmitter<string>();
  account?: Account;
  selectedPolicyId?: string | null;

  constructor(accountService: AccountService, private localStorageService: LocalStorageService) {
    this.selectedPolicyId = localStorageService.retrievePolicyId();
    accountService.account.subscribe(account => this.account = account);
  }

  ngOnInit(): void {
  }

  policyChanged() {
    this.localStorageService.storePolicyId(this.selectedPolicyId!);
    this.changedPolicyId.next(this.selectedPolicyId!);
  }

}
