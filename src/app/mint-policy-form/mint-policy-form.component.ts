import { AccountService } from './../account.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mint-policy-form',
  templateUrl: './mint-policy-form.component.html',
  styleUrls: ['./mint-policy-form.component.scss']
})
export class MintPolicyFormComponent implements OnInit {

  days = 365
  loading = false;

  constructor(private dialogRef: MatDialogRef<MintPolicyFormComponent>, private accountService: AccountService) { }

  ngOnInit(): void {
  }

  apply() {
    //if (confirm('Discard policy and start with a new one? You will not be able to mint more tokens for the old one!')) {
    this.accountService.discardPolicy(this.days);
    this.dialogRef.close(true);
    //}
  }

}
