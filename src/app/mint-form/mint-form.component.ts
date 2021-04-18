import { Component, OnInit } from '@angular/core';
import { MintOrderSubmission } from './../../cardano-tools-client/model/mintOrderSubmission';

@Component({
  selector: 'app-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss']
})
export class MintFormComponent implements OnInit {

  name: string = "";
  amount: number = 0;
  breakpoint: number = 0;

  public mintOrderSubmission: MintOrderSubmission = { tokens: [{ assetName: "", amount: 1 },{ assetName: "", amount: 1 },{ assetName: "", amount: 1 }] };

  constructor() { }

  cols = 1;

  ngOnInit(): void {
    this.breakpoint = window.innerWidth / 500;
  }

  onResize(event: any) {
    this.breakpoint = window.innerWidth / 500;
  }

  addToken() {
    this.mintOrderSubmission.tokens?.push({ assetName: "", amount: 1 });
  }

  onSubmit() {
    alert("Tanks");
  }
}
