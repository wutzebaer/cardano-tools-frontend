import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AccountPrivate, MintOnDemand, MintOnDemandLayer, MintOnDemandLayerFile, MintoOnDemandRestInterfaceService } from 'src/cardano-tools-client';
import { TokenRestInterfaceService } from './../../cardano-tools-client/api/tokenRestInterface.service';
import { AccountService } from './../account.service';
import { TokenDataWithMetadata, TokenEnhancerService } from './../token-enhancer.service';


@Component({
  selector: 'app-mint-on-demand',
  templateUrl: './mint-on-demand.component.html',
  styleUrls: ['./mint-on-demand.component.scss']
})
export class MintOnDemandComponent implements OnInit, OnDestroy {

  mintOnDemand: MintOnDemand = {
    layers: [
    ],
    width: 200,
    height: 200,
    metadataString: ''
  }
  samples: SafeUrl[][] = [];
  tokens: TokenDataWithMetadata[] = [];
  policyId = '';
  metadata: any;
  parseError = '';
  account?: AccountPrivate;
  accountSubscription: Subscription;
  files: Map<String, File> = new Map();
  urls: Map<String, any> = new Map();

  constructor(
    private tokenApi: TokenRestInterfaceService,
    private tokenEnhancerService: TokenEnhancerService,
    private sanitizer: DomSanitizer,
    private mintoOnDemandRestInterfaceService: MintoOnDemandRestInterfaceService,
    private accountService: AccountService,
  ) {

    this.accountSubscription = accountService.account.subscribe(account => {
      this.account = account;
    });

    this.metadata = {
      '721': {
        [this.policyId]: {
          'AssetName#$mintcount': {
            'name': 'MyNFTName #$mintcount',
            'description': 'My description',
            'image': '$ipfs',
            'attributes': []
          }
        }
      }
    };
    this.serializeMetaData();
  }

  ngOnInit(): void {
    this.addLayer();
    this.updateSamples();
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

  changePolicyId(newPolicyId: string) {
    this.metadata['721'][newPolicyId] = this.metadata['721'][this.policyId];
    delete this.metadata['721'][this.policyId]
    this.policyId = newPolicyId;
    this.serializeMetaData();
    this.tokenApi.policyTokens(newPolicyId).subscribe({ next: tokens => this.tokens = this.tokenEnhancerService.enhanceTokens(tokens) });
  }

  serializeMetaData() {
    const assetName = Object.keys(this.metadata['721'][this.policyId])[0];
    const assetObject = this.metadata['721'][this.policyId][assetName];
    assetObject.attributes = [];
    this.mintOnDemand.layers.forEach(layer => {
      assetObject.attributes.push({ [layer.name]: (layer.files.length ? layer.files[0].name.split('.')[1] : '') });
    });
    this.mintOnDemand.metadataString = JSON.stringify(this.metadata, null, 3);
    this.parseError = '';
    this.updateSamples();
  }

  deserializeMetaData() {
    try {
      let parsed = JSON.parse(this.mintOnDemand.metadataString);
      if (!parsed['721'][this.policyId]) {
        throw "PolicyId must be " + this.policyId;
      }
      this.metadata = parsed;
      this.parseError = '';
    } catch (error) {
      this.parseError = error as string;
    }
  }

  addLayer() {
    this.mintOnDemand.layers.push({
      name: 'Layer ' + (this.mintOnDemand.layers.length + 1),
      files: [
      ]
    });
    this.serializeMetaData()
  }

  removeLayer(layer: MintOnDemandLayer) {
    this.mintOnDemand.layers.splice(this.mintOnDemand.layers.indexOf(layer), 1);
    this.serializeMetaData()
  }

  removeFile(layer: MintOnDemandLayer, file: MintOnDemandLayerFile) {
    layer.files.splice(layer.files.indexOf(file), 1);
    this.serializeMetaData()
  }


  async addFiles(layer: MintOnDemandLayer, event: any) {
    let newFiles: MintOnDemandLayerFile[] = [];
    for (let index in Object.values(event.target.files)) {
      let file: File = event.target.files.item(index);
      if (file?.size as number > 52428800) {
        alert("Max 50mb");
        return;
      }

      const filename = (await this.sha256(file)) + '.' + file.name;
      this.files.set(filename, file);
      this.urls.set(filename, this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)))
      console.log(filename)

      newFiles.push({
        name: filename,
        weight: 1
      })
    }

    Array.prototype.unshift.apply(layer.files, newFiles);
    event.target.value = '';
    this.serializeMetaData()
  }

  async sha256(file: File) {
    // get byte array of file
    let buffer = await file.arrayBuffer();

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  updateSamples() {
    this.samples = [];
    for (let index = 0; index < 100; index++) {
      let sample: SafeUrl[] = [];
      this.mintOnDemand.layers.forEach(
        layer => {
          if (layer.files.length) {
            let totalWeight = layer.files.map(f => f.weight).reduce((p, c) => p + c, 0);
            let sum = 0;
            let target = Math.random() * totalWeight;
            for (let index in layer.files) {
              let file = layer.files[index];
              sum += file.weight;
              if (sum >= target) {
                sample.push(this.urls.get(file.name));
                break;
              }
            }
          }
        }
      );
      this.samples.push(sample);
    }
  }

  upload() {
    //let files: File[] = [];
    //this.mintOnDemand.layers.forEach(l => l.files.forEach(f => files.push(f.file)));
    this.mintoOnDemandRestInterfaceService.saveMintOnDemand(this.mintOnDemand, this.account!.key, this.policyId).subscribe(() => {
      this.mintOnDemand.layers.forEach(l => l.files.forEach(f => {
        this.mintoOnDemandRestInterfaceService.saveMintOnDemandFileForm(this.account!.key, this.policyId, f.name, this.files.get(f.name)).subscribe();
      }));
    });
  }

}
