import { TokenEnhancerService } from './../token-enhancer.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, ChangeDetectorRef } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RestInterfaceService, TokenSubmission } from 'src/cardano-tools-client';
import { HttpEventType } from '@angular/common/http';
import { ArrayDataSource } from '@angular/cdk/collections';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

export interface MetaValue {
  key: string;
  value: any;
}

@Component({
  selector: 'app-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintFormComponent implements OnInit {

  Object = Object;

  static globalCounter = 0;

  counter!: number;
  availableMetaFields: string[] = ['image', 'name', 'type', 'traits', 'artist', 'publisher', 'copyright', 'homepage', 'url'];
  listFields: string[] = ['traits'];
  uploadProgress: number = 0;
  metaData: any;
  previewUrl = ""
  previewType = ""

  @Input() token!: TokenSubmission;

  constructor(private sanitizer: DomSanitizer, private api: RestInterfaceService, private cdRef: ChangeDetectorRef, private tokenEnhancerService: TokenEnhancerService) {
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
    this.reloadMetadata()
  }

  reloadMetadata() {
    this.metaData = JSON.parse(this.token.metaData)
    this.updatePreview()
  }

  serializeMetadata() {
    console.log(this.metaData)
    this.token.metaData = JSON.stringify(this.metaData, null, 3)
  }

  isSimpleValue(value: any) {
    return typeof value !== 'object';
  }

  isSimpleList(value: any) {
    return Array.isArray(value) && typeof value[0] !== 'object';
  }

  addMetaField(metaField: string) {
    if (typeof this.metaData[metaField] !== 'undefined') {
      delete this.metaData[metaField];
    } else {
      if (this.listFields.indexOf(metaField) !== -1) {
        this.metaData[metaField] = [];
      } else {
        this.metaData[metaField] = "";
      }

    }
  }

  updatePreview() {
    if (this.metaData.files?.length) {
      this.previewType = this.metaData.files[0].mediaType
      this.previewUrl = this.tokenEnhancerService.toIpfsUrl(this.metaData.files[0].src)
    } else {
      this.previewType = ""
      this.previewUrl = ""
    }
    console.log(this.previewUrl)
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

    this.metaData["name"] = file.name.split(".")[0].substring(0, 60);
    this.token.assetName = file.name.split(".")[0].replace(/[^a-zA-Z0-9]/g, "").substring(0, 32);

    if (file?.size as number < 16384 && confirm('Store file onchain?')) {

      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = _event => {
        this.metaData["files"] = [{
          src: (reader.result as string).match(/.{1,64}/g),
          name: file.name,
          mediaType: file.type
        }]
        this.updatePreview()
      };

    } else {
      this.api.postFileForm(file as Blob, 'events', true).subscribe({
        error: (error) => { this.uploadProgress = 0; },
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              this.uploadProgress = event.loaded * 100 / event.total;
            }
          } else if (event.type === HttpEventType.Response) {

            // create metadata
            delete this.metaData["image"];
            if (file.type.startsWith('image')) {
              this.metaData["image"] = "ipfs://" + event.body;
            }

            this.metaData["files"] = [{
              src: "ipfs://" + event.body,
              name: file.name,
              mediaType: file.type
            }]
            this.updatePreview()

            this.uploadProgress = 0;
          }
        }
      });
    }

  }


  toArray(value: any[]): any[] {
    return value;
  }

  toString(value: any): string {
    return value;
  }

  toJson(value: any): string {
    return JSON.stringify(value);
  }
}
