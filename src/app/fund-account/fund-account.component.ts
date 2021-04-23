import { RestInterfaceService } from 'src/cardano-tools-client/api/restInterface.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fund-account',
  templateUrl: './fund-account.component.html',
  styleUrls: ['./fund-account.component.scss']
})
export class FundAccountComponent implements OnInit {

  @Input() fee!: number;

  constructor(private api: RestInterfaceService) { }

  ngOnInit(): void {
  }



}
