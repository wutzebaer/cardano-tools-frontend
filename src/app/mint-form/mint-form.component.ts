import { Body } from './../../cardano-tools-client/model/body';
import { RestInterfaceService } from './../../cardano-tools-client/api/restInterface.service';
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

  static counter = 0;
  availableMetaFields: string[] = ['Image', 'Audio', 'Video', 'Name', 'Type', 'Traits', 'Artist', 'Publisher', 'Copyright', 'Homepage'];
  listFields: string[] = ['Traits'];

  @Input() token!: TokenSubmission;
  metadata: Map<String, MetaValue> = new Map();
  file!: File | null;
  url!: SafeUrl;

  constructor(private sanitizer: DomSanitizer, private api: RestInterfaceService) {
    MintFormComponent.counter++;
  }

  ngOnInit(): void {
    this.token.assetName = "Token" + MintFormComponent.counter;
  }

  get counter() {
    return MintFormComponent.counter;
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
    this.appendFilelist(event.target.files);
    event.target.value = '';
  }

  appendFilelist(fileList: FileList) {
    let file = fileList.item(0);

    this.api.addFileForm(file as Blob, 'events', true).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          //this.spinnerValue = event.loaded * 100 / event.total;
          if (event.total) {
            console.log(event.loaded * 100 / event.total);
          }
        } else if (event.type === HttpEventType.Response) {
          console.log(event);
          this.file = file;
          const reader = new FileReader();
          reader.readAsDataURL(this.file as Blob);
          reader.onload = _event => {
            this.url = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
          };

          if (file?.type?.startsWith('image')) {
            this.metadata.set("Image", { value: "ipfs://" + event.body as string, listValue: [] });
          } else if (file?.type?.startsWith('video')) {
            this.metadata.set("Video", { value: "ipfs://" + event.body as string, listValue: [] });
          } else if (file?.type?.startsWith('audio')) {
            this.metadata.set("Audio", { value: "ipfs://" + event.body as string, listValue: [] });
          }
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
