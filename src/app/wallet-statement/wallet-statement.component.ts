import { MatSort } from '@angular/material/sort';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AccountStatementRow, WalletStatementRestInterfaceService } from 'src/cardano-tools-client';
import { LocalStorageService } from './../local-storage.service';

@Component({
  selector: 'app-wallet-statement',
  templateUrl: './wallet-statement.component.html',
  styleUrls: ['./wallet-statement.component.scss']
})
export class WalletStatementComponent implements OnInit {

  myaddress: string | null;
  //lines: Array<AccountStatementRow> = [];
  dataSource: MatTableDataSource<AccountStatementRow> = new MatTableDataSource();
  displayedColumns = ['timestamp', 'epoch', 'txHash', 'change', 'sum', 'operations']
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private localStorageService: LocalStorageService,
    private api: WalletStatementRestInterfaceService) {
      
    this.myaddress = localStorageService.retrieveMyAddress();
    this.update();

  }

  ngOnInit(): void {
  }


  update() {
    if (this.myaddress) {
      this.localStorageService.storeMyAddress(this.myaddress);
      this.api.accountStatement(this.myaddress)
        .subscribe(lines => {
          this.dataSource.data = lines
          this.dataSource.sort = this.sort;
        });
    }
  }

}
