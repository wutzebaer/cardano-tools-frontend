import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TokenSubmission } from 'src/cardano-tools-client';

@Component({
  selector: 'app-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintFormComponent implements OnInit {

  @Input() token!: TokenSubmission;

  static counter = 0;

  availableMetaFields: string[] = ['Image', 'Name', 'Type', 'Artist', 'Publisher'];
  file!: File | null;
  url!: SafeUrl;
  metadata: any = {};

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    MintFormComponent.counter++;
    this.token.assetName = "Token #" + MintFormComponent.counter;
  }

  get counter() {
    return MintFormComponent.counter;
  }

  metadataPresent(): boolean {
    return Object.keys(this.metadata).length > 0;
  }

  metaChipClick(metaField: string) {
    if (metaField in this.metadata) {
      delete this.metadata[metaField];
    } else {
      this.metadata[metaField] = "";
    }

  }

  dropFile(event: any) {
    event.preventDefault();
    this.appendFilelist(event.dataTransfer.files);
  }

  addFile(event: any) {
    console.log(event)
    this.appendFilelist(event.target.files);
    event.target.value = '';
  }

  appendFilelist(fileList: FileList) {
    this.file = fileList.item(0);
    console.log(this.file)

    const reader = new FileReader();
    reader.readAsDataURL(this.file as Blob);
    reader.onload = _event => {
      this.url = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    };
  }


}
