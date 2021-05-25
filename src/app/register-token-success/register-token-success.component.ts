import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-token-success',
  templateUrl: './register-token-success.component.html',
  styleUrls: ['./register-token-success.component.scss']
})
export class RegisterTokenSuccessComponent implements OnInit {

  tokenRegistration: string

  constructor(@Inject(MAT_DIALOG_DATA) public data: { tokenRegistration: string }) {
    this.tokenRegistration = data.tokenRegistration;
  }

  ngOnInit(): void {
  }

}
