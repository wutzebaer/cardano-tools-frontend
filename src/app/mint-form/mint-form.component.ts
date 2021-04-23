import { RestInterfaceService } from 'src/cardano-tools-client/api/restInterface.service';
import { Body } from './../../cardano-tools-client/model/body';
import { Component, Input, OnChanges, OnInit, SimpleChanges, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TokenSubmission } from 'src/cardano-tools-client';
import { HttpEventType } from '@angular/common/http';

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

  static globalCounter = 0;

  counter!: number;
  availableMetaFields: string[] = ['Image', 'Audio', 'Video', 'Binary', 'Filename', 'MimeType', 'Name', 'Type', 'Traits', 'Artist', 'Publisher', 'Copyright', 'Homepage'];
  listFields: string[] = ['Traits'];
  knownMimeTypes = ['image', 'video', 'audio'];
  uploadProgress: number = 0;

  @Input() token!: TokenSubmission;
  metadata: Map<String, MetaValue> = new Map();
  file!: File | null;
  url!: SafeUrl | null;;

  constructor(private sanitizer: DomSanitizer, private api: RestInterfaceService) {
    MintFormComponent.globalCounter++;
    this.counter = MintFormComponent.globalCounter;
    console.log("Construct", this.counter)
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

  ngOnInit(): void {
    this.token.assetName = "Token" + this.counter;
  }

  isListField(key: any) {
    return this.listFields.indexOf(key) != -1;
  }

  addMetaField(metaField: string) {
    if (this.metadata.has(metaField)) {
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
    console.log("addfile", this.counter, event)
    this.appendFilelist(event.target.files);
    event.target.value = '';
  }

  appendFilelist(fileList: FileList) {
    let file = fileList.item(0);

    if (file?.size as number > 52428800) {
      alert("Max 50mb");
      return;
    }

    this.api.addFileForm(file as Blob, 'events', true).subscribe({
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
            const reader = new FileReader();
            reader.readAsDataURL(file as Blob);
            reader.onload = _event => {
              this.url = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
            };
          } else {
            this.url = null;
          }

          this.metadata.delete("Image");
          this.metadata.delete("Video");
          this.metadata.delete("Audio");
          this.metadata.delete("Binary");

          // create metadata
          if (this.getFileType() == 'image') {
            this.metadata.set("Image", { value: "ipfs://" + event.body as string, listValue: [] });
          } else if (this.getFileType() == 'video') {
            this.metadata.set("Video", { value: "ipfs://" + event.body as string, listValue: [] });
          } else if (this.getFileType() == 'audio') {
            this.metadata.set("Audio", { value: "ipfs://" + event.body as string, listValue: [] });
          } else {
            this.metadata.set("Binary", { value: "ipfs://" + event.body as string, listValue: [] });
          }
          this.metadata.set("Filename", { value: file?.name as string, listValue: [] });
          this.metadata.set("MimeType", { value: file?.type as string, listValue: [] });
          this.uploadProgress = 0;

        }
      }
    });

  }

  /*
    this.kundeControllerService.uploadMitarbeiterMessage(this.msgIsVip, this.message, this.files, 'events', true).subscribe(
      {
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.spinnerValue = event.loaded * 100 / event.total;
          }
        },
        complete: () => {
          this.isLoadingResults = false;
          alert(this.translateService.instant('pnupload.upload_success'));
          this.reset();
        },
        error: (e: HttpErrorResponse) => {
          this.isLoadingResults = false;
          if (e.status !== 0) {
            const errMsg = e.error.usermessage;
            if (errMsg && errMsg.indexOf('Virus') > 0) {
              this.removeAllAttachments();
            }
          }
        }
      }
    );
  */
}
