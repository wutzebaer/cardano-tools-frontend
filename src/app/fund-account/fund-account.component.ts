import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { RestInterfaceService, TransferAccount } from 'src/cardano-tools-client';



@Component({
  selector: 'app-fund-account',
  templateUrl: './fund-account.component.html',
  styleUrls: ['./fund-account.component.scss']
})
export class FundAccountComponent implements OnInit {

  @Input() fee!: number | null;
  @Input() account!: TransferAccount | null;

  constructor(private api: RestInterfaceService) { }


  ngOnInit(): void {

  }



}
