import { PolicyConfigPrivate } from './../../cardano-tools-client/model/policyConfigPrivate';
import { AccountService } from './../account.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mint-policy-form',
  templateUrl: './mint-policy-form.component.html',
  styleUrls: ['./mint-policy-form.component.scss'],
})
export class MintPolicyFormComponent implements OnInit {
  policyConfig: PolicyConfigPrivate = {
    days: 365,
  };
  loading = false;
  import = false;

  constructor(
    private dialogRef: MatDialogRef<MintPolicyFormComponent>,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {}

  apply() {
    this.accountService.createPolicy(this.policyConfig);
    this.dialogRef.close(true);
  }
}
