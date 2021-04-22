import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TokenSubmission } from 'src/cardano-tools-client';

export interface MetaValue {
  value: string;
  listValue: string[];
}

@Component({
  selector: 'app-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintFormComponent implements OnInit {


  @Input() token!: TokenSubmission;

  static counter = 0;

  availableMetaFields: string[] = ['Image', 'Audio', 'Video', 'Name', 'Type', 'Traits', 'Artist', 'Publisher'];
  listFields: string[] = ['Traits'];

  file!: File | null;
  url!: SafeUrl;
  metadata: Map<String, MetaValue> = new Map();


  constructor(private sanitizer: DomSanitizer) {
    MintFormComponent.counter++;
  }

  logMetadata() {
    console.log(this.metadata);
  }

  asStringArray(val: any): string[] { return val; }

  ngOnInit(): void {
    this.token.assetName = "Token" + MintFormComponent.counter;
  }

  get counter() {
    return MintFormComponent.counter;
  }

  isListField(key: any) {
    return this.listFields.indexOf(key) != -1;
  }

  metadataPresent(): boolean {
    return Object.keys(this.metadata).length > 0;
  }

  addMetaField(metaField: string) {
    console.log(this.metadata);
    if (metaField in this.metadata) {
      this.metadata.delete(metaField);
    } else {
      this.metadata.set(metaField, { value: "", listValue: [] });
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
