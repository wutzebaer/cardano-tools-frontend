import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss']
})
export class MintFormComponent implements OnInit {

  name: string = "";
  amount: number = 0;
  breakpoint: number = 0;

  public tokens = [{}, {}, {}, {}, {}];

  //public orders: MintOrder[] = [];

  constructor() { }

  cols = 1;

  ngOnInit(): void {
    this.breakpoint = window.innerWidth / 500;
  }

  onResize(event: any) {
    this.breakpoint = window.innerWidth / 500;
  }

  addToken() {
    this.tokens.push({});
  }

  onSubmit() {
    alert("Tanks");
  }
}
