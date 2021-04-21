import { Component, OnInit } from '@angular/core';
import { MintOrderSubmission } from './../../cardano-tools-client/model/mintOrderSubmission';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss']
})
export class MintFormComponent implements OnInit {

  name: string = "";
  amount: number = 0;

  public mintOrderSubmission: MintOrderSubmission = { tokens: [] };

  constructor() { }

  ngOnInit(): void {
    this.addToken();
  }

  addToken() {
    let token = { assetName: "", amount: 1 };
    this.mintOrderSubmission.tokens.push(token);
  }

  removeToken(index: number) {
    this.mintOrderSubmission.tokens.splice(index, 1);
  }

  onSubmit() {
    alert("Tanks");
  }
}
