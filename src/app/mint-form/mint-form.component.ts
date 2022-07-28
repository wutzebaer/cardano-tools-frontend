import { HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MintRestInterfaceService, TokenSubmission } from 'src/cardano-tools-client';
import { TokenEnhancerService } from './../token-enhancer.service';

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
  static availableMetaFields: string[] = ['project', 'description', 'type', 'artist', 'publisher', 'copyright', 'homepage', 'website', 'url', 'twitter', 'discord'];
  requiredMetaFields: string[] = ['image', 'name', 'mediaType'];
  lockedMetaFields: string[] = ['mediaType', 'image'];
  listFields: string[] = ['traits'];
  mapFields: string[] = ['attributes'];
  uploadProgress: number = 0;
  metaData: any = {};
  previewUrl = ""
  previewType = ""
  isNft = true

  @Input() token!: TokenSubmission;
  @Output() spreadMetaValue = new EventEmitter<MetaValue>();

  constructor(private sanitizer: DomSanitizer, private api: MintRestInterfaceService, private cdRef: ChangeDetectorRef, public tokenEnhancerService: TokenEnhancerService) {
    MintFormComponent.globalCounter++;
    this.counter = MintFormComponent.globalCounter;
  }

  ngOnInit(): void {
    if (!this.token.assetName) {
      this.token.assetName = "Token" + this.counter;
    }

    let hack = this.token as any
    if (hack.file) {
      this.appendFile(hack.file)
      delete hack.file
    }

    if (hack.metaData) {
      this.metaData = hack.metaData
      delete hack.metaData
    } else {
      if (!this.metaData.name) {
        this.metaData.name = "";
      }
      if (!this.metaData.image) {
        this.metaData.image = "";
      }
    }


    this.reloadMetadata()
  }

  reloadMetadata() {
    this.updatePreview()
  }

  isSimpleValue(value: any) {
    return typeof value !== 'object';
  }

  isSimpleList(value: any) {
    return Array.isArray(value) && typeof value[0] !== 'object' && !(value[0] + '').startsWith('data:');
  }

  isSimpleObjectList(value: any) {
    return Array.isArray(value) && typeof value[0] === 'object' && Object.keys(value[0]).length === 1 && typeof value[0][Object.keys(value[0])[0]] !== 'object';
  }

  spreadMetaValueClicked(key: string, value: any) {
    this.spreadMetaValue.emit({ key: key, value: value });
  }

  addMetaField(metaField: string) {
    if (typeof this.metaData[metaField] !== 'undefined') {
      delete this.metaData[metaField];
    }
    else if (this.listFields.indexOf(metaField) !== -1) {
      this.metaData[metaField] = [];
    }
    else if (this.mapFields.indexOf(metaField) !== -1) {
      let key = prompt("Enter name of first attribute") as string;
      if (!key) {
        return;
      }
      this.metaData[metaField] = [{ [key]: "" }];
    }
    else {
      this.metaData[metaField] = "";
    }

    this.updatePreview();
  }

  get availableMetaFields() {
    return MintFormComponent.availableMetaFields;
  }

  addNewMetaField() {
    let key = prompt("Enter name of new attribute") as string;
    if (!key) {
      return;
    }
    this.metaData[key] = "";
    MintFormComponent.availableMetaFields.push(key)
  }

  addSimpleObjectListItem(list: any[]) {
    let key = prompt("Enter name of new attribute") as string;
    if (!key) {
      return;
    }
    list.push({ [key]: "" })
  }
  removeSimpleObjectListItem(metaDataKey: string, object: any) {
    let list = this.metaData[metaDataKey];
    const index = list.indexOf(object);
    if (index >= 0) {
      list.splice(index, 1);
    }
    if (list.length === 0) {
      delete this.metaData[metaDataKey];
    }
  }

  updatePreview() {
    if (this.metaData.image) {
      this.previewType = 'image'
      this.previewUrl = this.tokenEnhancerService.toIpfsUrl(this.metaData.image)
    }
    else {
      this.previewType = ""
      this.previewUrl = ""
    }
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

    if (file?.size as number > 104857600) {
      alert("Max 100mb");
      return;
    }

    this.metaData["name"] = file.name.split(".")[0].substring(0, 60);
    this.token.assetName = file.name.split(".")[0].replace(/[^a-zA-Z0-9]/g, "").substring(0, 32);

    if (file?.size as number < 16384 && confirm('Store file ' + file.name + ' onchain?')) {

      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = _event => {

        // create metadata
        if (file.type.startsWith('image') && !this.metaData["image"]) {
          this.metaData["image"] = (reader.result as string).match(/.{1,64}/g);
          this.metaData["mediaType"] = file.type
        } else {
          if (!this.metaData["files"]) {
            this.metaData["files"] = [];
          }
          this.metaData["files"].push({
            src: (reader.result as string).match(/.{1,64}/g),
            name: file.name,
            mediaType: file.type
          })
        }

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
            if (file.type.startsWith('image') && !this.metaData["image"]) {
              this.metaData["image"] = "ipfs://" + event.body;
              this.metaData["mediaType"] = file.type
            } else {
              if (!this.metaData["files"]) {
                this.metaData["files"] = [];
              }
              this.metaData["files"].push({
                src: "ipfs://" + event.body,
                name: file.name,
                mediaType: file.type
              })
            }

            this.updatePreview()

            this.uploadProgress = 0;
          }
        }
      });
    }

  }

  removeFile(file: any) {
    const index = this.metaData["files"].indexOf(file);
    this.metaData["files"].splice(index, 1);
    if (this.metaData["files"].length == 0) {
      delete this.metaData["files"]
    }
    this.updatePreview();
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

  openPoolPmPreview() {
    const metadata = { '721': { '00000000000000000000000000000000000000000000000000000000': { [this.token.assetName]: this.metaData } } };
    window.open('https://pool.pm/test/metadata?metadata=' + encodeURIComponent(encodeURIComponent(JSON.stringify(metadata))));
  }

  isNftChanged() {
    if (this.isNft) {
      this.token.amount = 1;
    }
  }

}
