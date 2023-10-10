import { ImprintComponent } from './../imprint/imprint.component';
import { ContactComponent } from './../contact/contact.component';
import { TermsOfServiceComponent } from './../terms-of-service/terms-of-service.component';
import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  tos() {
    this.dialog.open(TermsOfServiceComponent);
  }

  contact() {
    this.dialog.open(ContactComponent);
  }

  imprint() {
    this.dialog.open(ImprintComponent);
  }
}
