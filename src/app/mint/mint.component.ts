import { MintFormComponent } from './../mint-form/mint-form.component';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestInterfaceService } from 'src/cardano-tools-client/api/restInterface.service';
import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper!: MatStepper;

  name: string = "";
  amount: number = 0;
  fee: number = 0;

  mintOrderSubmission: MintOrderSubmission = { tokens: [] };

  constructor(private api: RestInterfaceService) { }

  ngOnInit(): void {
    this.addToken();
  }

  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      if (event.selectedIndex == 0) {
      } else if (event.selectedIndex == 1) {
        this.api.calculateFee(this.mintOrderSubmission).subscribe(fee => {
          this.fee = fee;
        });
      }
    });
  }

  addToken() {
    let token = { assetName: "", amount: 1, metaData: {} };
    this.mintOrderSubmission.tokens.push(token);
  }

  removeToken(index: number) {
    this.mintOrderSubmission.tokens.splice(index, 1);
  }

}
