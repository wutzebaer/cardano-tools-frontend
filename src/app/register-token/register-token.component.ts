import { RegistrationMetadata } from './../../cardano-tools-client/model/registrationMetadata';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RestInterfaceService } from 'src/cardano-tools-client';

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

  constructor(private api: RestInterfaceService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  loadTransaction() {
    this.api.getRegistrationMetadata(this.accountKey).subscribe(registrationMetadata => {
      console.log(registrationMetadata);
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
    console.log(this.registrationMetadata);
    console.log(this.file);
    this.api.generateTokenRegistrationForm(JSON.stringify(this.registrationMetadata), this.file as Blob).subscribe(tokenRegistration => {

      var myblob = new Blob([tokenRegistration.content], {
        type: 'text/plain'
      });

      this.openDialogForBlob(tokenRegistration.filename, myblob)

    })
  }

  openDialogForBlob(fileName: string, blob: Blob) {
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    }
  }

}
