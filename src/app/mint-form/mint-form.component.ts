import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, ChangeDetectorRef } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RestInterfaceService, TokenSubmission } from 'src/cardano-tools-client';
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintFormComponent implements OnInit {

  static globalCounter = 0;

  counter!: number;
  availableMetaFields: string[] = ['Image', 'Audio', 'Video', 'Binary', 'MimeType', 'Name', 'Type', 'Traits', 'Artist', 'Publisher', 'Copyright', 'Homepage', 'Url'];
  listFields: string[] = ['Traits'];
  knownMimeTypes = ['image', 'video', 'audio'];
  uploadProgress: number = 0;

  @Input() token!: TokenSubmission;
  file!: File | null;
  url!: SafeUrl | null;;

  constructor(private sanitizer: DomSanitizer, private api: RestInterfaceService, private cdRef: ChangeDetectorRef) {
    MintFormComponent.globalCounter++;
    this.counter = MintFormComponent.globalCounter;
  }

  ngOnInit(): void {
    this.token.assetName = "Token" + this.counter;
    let hack = this.token as any
    if (hack.file) {
      this.appendFile(hack.file)
      delete hack.file
    }
  }

  getFileType() {
    if (!this.file) {
      return "";
    } else {
      return this.file.type.split("/")[0];
    }
  }

  isFileTypeKnown() {
    return this.knownMimeTypes.indexOf(this.getFileType()) != -1;
  }

  isListField(key: any) {
    return this.listFields.indexOf(key) != -1;
  }

  addMetaField(metaField: string) {
    if (this.token.metaData[metaField]) {
      delete this.token.metaData[metaField];
    } else {
      this.token.metaData[metaField] = { value: "", listValue: [] };
    }
  }

  dropFile(event: any) {
    event.preventDefault();
    this.appendFile(event.dataTransfer.files.item(0));
  }

  addFile(event: any) {
    console.log("addfile", this.counter, event)
    this.appendFile(event.target.files.item(0));
    event.target.value = '';
  }

  appendFile(file: File) {

    if (file?.size as number > 52428800) {
      alert("Max 50mb");
      return;
    }

    this.api.postFileForm(file as Blob, 'events', true).subscribe({
      error: (error) => { this.uploadProgress = 0; },
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            this.uploadProgress = event.loaded * 100 / event.total;
          }
        } else if (event.type === HttpEventType.Response) {
          console.log(event);

          // store file
          this.file = file;

          // create preview url
          if (this.isFileTypeKnown()) {
            this.url = "https://ipfs.cardano-tools.io/ipfs/" + event.body
          } else {
            this.url = null;
          }

          delete this.token.metaData["Image"];
          delete this.token.metaData["Video"];
          delete this.token.metaData["Audio"];
          delete this.token.metaData["Binary"];

          // create metadata
          if (this.getFileType() == 'image') {
            this.token.metaData["Image"] = { value: "ipfs://" + event.body as string, listValue: [] };
          } else if (this.getFileType() == 'video') {
            this.token.metaData["Video"] = { value: "ipfs://" + event.body as string, listValue: [] };
          } else if (this.getFileType() == 'audio') {
            this.token.metaData["Audio"] = { value: "ipfs://" + event.body as string, listValue: [] };
          } else {
            this.token.metaData["Binary"] = { value: "ipfs://" + event.body as string, listValue: [] };
          }
          this.token.metaData["MimeType"] = { value: file?.type as string, listValue: [] };
          this.token.metaData["Name"] = { value: (file?.name as string).split(".")[0].substring(0, 60) as string, listValue: [] };
          this.token.assetName = (file?.name as string).split(".")[0].replace(/[^a-zA-Z0-9]/g, "").substring(0, 32);
          this.uploadProgress = 0;

        }
      }
    });

  }

}
