import { Account } from 'src/cardano-tools-client';
import { AccountService } from './../account.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exchange-sell',
  templateUrl: './exchange-sell.component.html',
  styleUrls: ['./exchange-sell.component.scss']
})
export class ExchangeSellComponent implements OnInit {

  account!: Account;

  constructor(private accountService: AccountService) {
    accountService.account.subscribe(account => this.account = account);
  }

  ngOnInit(): void {

  }

}
