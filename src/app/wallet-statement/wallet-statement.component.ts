import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import {
  AccountStatementRow,
  PriceDto,
  WalletStatementRestInterfaceService,
} from 'src/cardano-tools-client';
import { LocalStorageService } from './../local-storage.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-wallet-statement',
  templateUrl: './wallet-statement.component.html',
  styleUrls: ['./wallet-statement.component.scss'],
})
export class WalletStatementComponent implements OnInit {
  myaddress: string | null;
  //lines: Array<AccountStatementRow> = [];
  dataSource: MatTableDataSource<AccountStatementRow> =
    new MatTableDataSource();
  displayedColumns = [
    'timestamp',
    'epoch',
    'txHash',
    'change',
    'changeInFiat',
    'sum',
    'operations',
  ];
  prices: { [key: string]: PriceDto } = {};
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('table') table!: ElementRef;

  constructor(
    private localStorageService: LocalStorageService,
    private api: WalletStatementRestInterfaceService,
    private datePipe: DatePipe
  ) {
    this.myaddress = localStorageService.retrieveMyAddress();
    this.update();
    api.prices('eur').subscribe((prices) => (this.prices = prices));
  }

  ngOnInit(): void {}

  update() {
    if (this.myaddress) {
      this.localStorageService.storeMyAddress(this.myaddress);
      this.api.accountStatement(this.myaddress, 'eur').subscribe((lines) => {
        let lastBalance = 0;
        for (let i = 0; i < lines.length; i++) {
          let currentRow = lines[i];
          currentRow.sum = lastBalance + currentRow.change!;
          lastBalance = currentRow.sum;
        }

        this.dataSource.data = lines;
        this.dataSource.sort = this.sort;
      });
    }
  }

  getPrice(date: Date) {
    return this.prices[this.datePipe.transform(date, 'yyyy-MM-dd')!].value;
  }

  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    ); //converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
}
