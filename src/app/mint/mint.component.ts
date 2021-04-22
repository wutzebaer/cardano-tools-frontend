import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestInterfaceService } from 'src/cardano-tools-client/api/restInterface.service';
import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {

  @ViewChildren('appMintForm') appMintForms!: QueryList<ElementRef>

  name: string = "";
  amount: number = 0;
  fee: number = 0;

  public mintOrderSubmission: MintOrderSubmission = { tokens: [] };

  constructor(private api: RestInterfaceService, private _formBuilder: FormBuilder) { }

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

  calcFee() {
    this.api.calculateFee(this.mintOrderSubmission).subscribe(fee => {
      this.fee = fee;
    });
  }
}
