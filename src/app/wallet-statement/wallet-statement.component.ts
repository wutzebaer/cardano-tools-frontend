import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountStatementRow, WalletStatementRestInterfaceService } from 'src/cardano-tools-client';
import { LocalStorageService } from './../local-storage.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-wallet-statement',
  templateUrl: './wallet-statement.component.html',
  styleUrls: ['./wallet-statement.component.scss']
})
export class WalletStatementComponent implements OnInit {

  myaddress: string | null;
  //lines: Array<AccountStatementRow> = [];
  dataSource: MatTableDataSource<AccountStatementRow> = new MatTableDataSource();
  displayedColumns = ['timestamp', 'epoch', 'txHash', 'change', 'changeInFiat', 'sum', 'operations']
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('table') table!: ElementRef;

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
      this.api.accountStatement(this.myaddress, 'eur')
        .subscribe(lines => {

          let lastBalance = 0;
          for (let i = 0; i < lines.length; i++) {
            let currentRow = lines[i];
            currentRow.sum = lastBalance + currentRow.change!;
            lastBalance = currentRow.sum;
          }

          this.dataSource.data = lines
          this.dataSource.sort = this.sort;
        });
    }
  }

  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');

  }

}
