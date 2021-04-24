import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { interval } from 'rxjs';
import { RestInterfaceService, TransferAccount } from 'src/cardano-tools-client';



@Component({
  selector: 'app-fund-account',
  templateUrl: './fund-account.component.html',
  styleUrls: ['./fund-account.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FundAccountComponent implements OnInit {

  @Input() fee!: number | null;
  @Input() account!: TransferAccount | null;
  constructor(private api: RestInterfaceService) { }
  muh = 0

  ngOnInit(): void {
    interval(10000).subscribe(() => {
      if (this.adaBalance < this.minAdaBalance)
        this.refresh();
    });
  }

  get minAdaBalance() {
    return ((this.fee || 0)) / 1000000 + 1;
  }

  get minAdaTipBalance() {
    return ((this.fee || 0)) / 1000000 + 2;
  }

  get adaBalance() {
    return ((this.account?.balance || 0)) / 1000000;
  }

  refresh() {
    if (this.account) {
      this.api.getAccount(this.account.key as string).subscribe(account => {
        if (this.account != null) {
          this.account.balance = account.balance;
        }
      });
    }
  }

}
