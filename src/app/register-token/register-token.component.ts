import { RegisterTokenSuccessComponent } from './../register-token-success/register-token-success.component';
import { RegistrationMetadata } from './../../cardano-tools-client/model/registrationMetadata';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RestInterfaceService } from 'src/cardano-tools-client';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register-token',
  templateUrl: './register-token.component.html',
  styleUrls: ['./register-token.component.scss']
})
export class RegisterTokenComponent implements OnInit {

  registrationMetadata: RegistrationMetadata = {
    assetName: "",
    policyId: "",
    policy: "",
    policySkey: "",
    name: "",
    description: "",

    ticker: "",
    url: "",
  }

  accountKey = ""

  uploadProgress: number = 0;

  file!: File | null;
  url!: SafeUrl | null;

  constructor(private api: RestInterfaceService, private sanitizer: DomSanitizer, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  loadTransaction() {
    this.api.getRegistrationMetadata(this.accountKey).subscribe(registrationMetadata => {
      this.registrationMetadata = registrationMetadata
    })
  }

  dropFile(event: any) {
    event.preventDefault();
    this.appendFile(event.dataTransfer.files.item(0));
  }

  addFile(event: any) {
    this.appendFile(event.target.files.item(0));
    event.target.value = '';
  }

  appendFile(file: File) {

    if (file?.size as number > 52428800) {
      alert("Max 50mb");
      return;
    }

    this.file = file
    const reader = new FileReader();
    reader.readAsDataURL(this.file as Blob);
    reader.onload = _event => {
      this.url = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    };

  }

  generateRegistration() {
    this.api.generateTokenRegistrationForm(JSON.stringify(this.registrationMetadata), this.file as Blob).subscribe(tokenRegistration => {

      this.dialog.open(RegisterTokenSuccessComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: { tokenRegistration: tokenRegistration },
        closeOnNavigation: true
      });


    })
  }


}
