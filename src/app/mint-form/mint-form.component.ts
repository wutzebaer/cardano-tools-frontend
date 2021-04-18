import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss']
})
export class MintFormComponent implements OnInit {

  public name: string = "";
  public amount: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    alert("Tanks");
  }
}
