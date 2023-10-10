import { WalletConnectServiceService } from './../wallet-connect-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet-connect-button',
  templateUrl: './wallet-connect-button.component.html',
  styleUrls: ['./wallet-connect-button.component.scss'],
})
export class WalletConnectButtonComponent implements OnInit {
  constructor(
    private walletConnectServiceService: WalletConnectServiceService
  ) {}

  ngOnInit(): void {}
}
