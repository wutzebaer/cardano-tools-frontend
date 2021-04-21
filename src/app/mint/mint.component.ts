import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MintOrderSubmission } from '../../cardano-tools-client/model/mintOrderSubmission';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {

  @ViewChildren('appMintForm') appMintForms!: QueryList<ElementRef>

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
    console.log(this.appMintForms.length)
    alert("Tanks");
  }
}
