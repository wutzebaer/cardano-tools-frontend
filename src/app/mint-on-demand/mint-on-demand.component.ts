import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AccountPrivate, MintOnDemand, MintOnDemandLayer, MintOnDemandLayerFile, MintoOnDemandRestInterfaceService } from 'src/cardano-tools-client';
import { TokenRestInterfaceService } from './../../cardano-tools-client/api/tokenRestInterface.service';
import { AccountService } from './../account.service';
import { TokenDataWithMetadata, TokenEnhancerService } from './../token-enhancer.service';


export interface Permutation {
  
}

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
    metadataString: '',
    amount: 1000
  }
  samples: SafeUrl[][] = [];
  tokens: TokenDataWithMetadata[] = [];
  policyId = '';
  metadataTemplate: any;
  metadataTemplateString: string = '';
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

    this.metadataTemplate = {
      '721': {
        [this.policyId]: {
          'AssetName#$number': {
            'name': 'MyNFTName #$number',
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
    this.metadataTemplate['721'][newPolicyId] = this.metadataTemplate['721'][this.policyId];
    delete this.metadataTemplate['721'][this.policyId]
    this.policyId = newPolicyId;
    this.serializeMetaData();
    this.tokenApi.policyTokens(newPolicyId).subscribe({ next: tokens => this.tokens = this.tokenEnhancerService.enhanceTokens(tokens) });
  }

  serializeMetaData() {
    const assetName = Object.keys(this.metadataTemplate['721'][this.policyId])[0];
    const assetObject = this.metadataTemplate['721'][this.policyId][assetName];
    assetObject.attributes = [];
    this.mintOnDemand.layers.forEach(layer => {
      assetObject.attributes.push({ [layer.name]: (layer.files.length ? layer.files[0].name.split('.').slice(0, -1).join('.') : '') });
    });


    this.metadataTemplateString = JSON.stringify(this.metadataTemplate, null, 3);
    this.parseError = '';
    this.updateSamples();
    this.generateMetadata();
  }

  deserializeMetaData() {
    try {
      let parsed = JSON.parse(this.metadataTemplateString);
      if (!parsed['721'][this.policyId]) {
        throw "PolicyId must be " + this.policyId;
      }
      this.metadataTemplate = parsed;
      this.parseError = '';
    } catch (error) {
      this.parseError = error as string;
    }
  }

  permuteLayers(layerIndex: number = 0, register: MintOnDemandLayerFile[] = [], result: MintOnDemandLayerFile[][] = []) {
    if (layerIndex >= this.mintOnDemand.layers.length) {
      result.push([...register]);
      return result;
    }
    const layer = this.mintOnDemand.layers[layerIndex];
    layer.files.forEach(f => {
      register[layerIndex] = f;
      this.permuteLayers(layerIndex + 1, register, result);
    });
    return result;
  }

  generateMetadata() {
    console.log('generateMetadata')
    let permuteLayers = this.permuteLayers();
    console.log(permuteLayers);

    let parsed = JSON.parse(this.metadataTemplateString);
    const assetName = Object.keys(parsed['721'][this.policyId])[0];
    const assetObjectTemplate = JSON.stringify(parsed['721'][this.policyId][assetName]);
    this.metadataTemplate['721'][this.policyId][assetName]
    delete parsed['721'][this.policyId][assetName];


    for (let number = 1; number <= this.mintOnDemand.amount; number++) {
      const assetObject = JSON.parse(assetObjectTemplate.replace('$number', number.toString()));
      assetObject.attributes = [];

      this.mintOnDemand.layers.forEach(layer => {
        let file = this.getWeightedRandomLayerFile(layer);
        assetObject.attributes.push({ [layer.name]: (file ? file.name.split('.').slice(0, -1).join('.') : '') });
      });

      parsed['721'][this.policyId][assetName.replace('$number', number.toString())] = assetObject;
    }
    this.mintOnDemand.metadataString = JSON.stringify(parsed, null, 3);
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


  addFiles(layer: MintOnDemandLayer, event: any) {
    let newFiles: MintOnDemandLayerFile[] = [];
    for (let index in Object.values(event.target.files)) {
      let file: File = event.target.files.item(index);
      if (file?.size as number > 52428800) {
        alert("Max 50mb");
        return;
      }

      const filename = file.name;
      this.files.set(filename, file);
      this.urls.set(filename, this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)))

      newFiles.push({
        name: filename,
        weight: 1
      })
    }

    Array.prototype.unshift.apply(layer.files, newFiles);
    event.target.value = '';
    this.serializeMetaData()
  }

  getWeightedRandomLayerFile(layer: MintOnDemandLayer) {
    if (layer.files.length) {
      let totalWeight = layer.files.map(f => f.weight).reduce((p, c) => p + c, 0);
      let sum = 0;
      let target = Math.random() * totalWeight;
      for (let index in layer.files) {
        let file = layer.files[index];
        sum += file.weight;
        if (sum >= target) {
          return file;
        }
      }
    }
    return null;
  }

  updateSamples() {
    this.samples = [];
    for (let index = 0; index < 100; index++) {
      let sample: SafeUrl[] = [];
      this.mintOnDemand.layers.forEach(
        layer => {
          let file = this.getWeightedRandomLayerFile(layer);
          if (file) {
            sample.push(this.urls.get(file.name));
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
