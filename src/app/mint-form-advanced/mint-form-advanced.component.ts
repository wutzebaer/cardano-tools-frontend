import { MintTransaction } from './../../cardano-tools-client/model/mintTransaction';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MintOrderSubmission, RestInterfaceService } from 'src/cardano-tools-client';

@Component({
  selector: 'app-mint-form-advanced',
  templateUrl: './mint-form-advanced.component.html',
  styleUrls: ['./mint-form-advanced.component.scss']
})
export class MintFormAdvancedComponent implements OnInit {

  mintTransaction: MintTransaction;
  mintOrderSubmission: MintOrderSubmission
  accountKey = ""

  constructor(@Inject(MAT_DIALOG_DATA) public data: { mintOrderSubmission: MintOrderSubmission, mintTransaction: MintTransaction }, private api: RestInterfaceService) {
    this.mintOrderSubmission = data.mintOrderSubmission;
    this.mintTransaction = data.mintTransaction;
  }

  ngOnInit(): void {
  }

  loadTransaction() {
    this.api.getRegistrationMetadata(this.accountKey).subscribe(registrationMetadata => {
      console.log(registrationMetadata);
      this.mintOrderSubmission.policyId = registrationMetadata.policyId
      this.mintOrderSubmission.policy = registrationMetadata.policy
    })
  }

}
