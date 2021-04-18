import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { TokenSubmission } from 'src/cardano-tools-client';

@Component({
  selector: 'app-mint-token',
  templateUrl: './mint-token.component.html',
  styleUrls: ['./mint-token.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintTokenComponent implements OnInit {

  @Input() token!: TokenSubmission;

  metadata: any = { name: "", type: "", image: "" };

  constructor() { }

  ngOnInit(): void {
  }

}
