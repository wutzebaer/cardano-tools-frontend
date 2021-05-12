import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MintOrderSubmission } from 'src/cardano-tools-client';

@Component({
  selector: 'app-mint-form-advanced',
  templateUrl: './mint-form-advanced.component.html',
  styleUrls: ['./mint-form-advanced.component.scss']
})
export class MintFormAdvancedComponent implements OnInit {

  mintOrderSubmission: MintOrderSubmission

  constructor(@Inject(MAT_DIALOG_DATA) public data: { mintOrderSubmission: MintOrderSubmission }) {
    this.mintOrderSubmission = data.mintOrderSubmission;
  }

  ngOnInit(): void {
  }

}
