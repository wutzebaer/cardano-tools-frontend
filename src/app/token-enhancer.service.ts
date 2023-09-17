import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenDetails } from 'src/dbsync-client';


export interface TokenDataWithMetadata extends TokenDetails {
  metaDataObject: any
  //tokenRegistryMetadata: TokenRegistryMetadata
  mediaTypes: string[]
  mediaUrls: any[]
  lockDate?: Date
  timestamp: Date
  locked: boolean
  nft: boolean
}

@Injectable({
  providedIn: 'root'
})
export class TokenEnhancerService {

  constructor(private sanitizer: DomSanitizer) { }

  enhanceToken(element: TokenDetails): TokenDataWithMetadata {
    // cast element
    let tokenDataWithMetadata = element as TokenDataWithMetadata;
    tokenDataWithMetadata.mediaTypes = []
    tokenDataWithMetadata.mediaUrls = []
    tokenDataWithMetadata.metaDataObject = {}

    // timestamp
    tokenDataWithMetadata.timestamp = new Date((1596491091 + (tokenDataWithMetadata.slotNo - 4924800)) * 1000)

    // find lockdate
    tokenDataWithMetadata.locked = false;
    tokenDataWithMetadata.nft = false;

    // parse policy
    if (tokenDataWithMetadata.maPolicyScript) {
      let policy = JSON.parse(tokenDataWithMetadata.maPolicyScript);
      if (policy.type === 'all') {
        let minLockDate: Date | undefined;
        policy.scripts?.forEach((script: any) => {
          if (script.type === 'before') {
            let slot = script.slot
            let lockDate = new Date((1596491091 + (slot - 4924800)) * 1000)
            if (!minLockDate || lockDate < minLockDate) {
              minLockDate = lockDate;
            }
          }
        });
        tokenDataWithMetadata.lockDate = minLockDate
        if (minLockDate && (minLockDate < new Date())) {
          tokenDataWithMetadata.locked = true;
        }
        tokenDataWithMetadata.nft = tokenDataWithMetadata.locked && tokenDataWithMetadata.totalSupply === 1;
      }
    }

    // check if transaction metadata present
    if (element.metadata && element.metadata !== 'null') {

      // find metadata of token in transaction metadata
      let metaData = JSON.parse(element.metadata)

      if (Array.isArray(metaData['files'])) {
        metaData['files'].forEach(file => {
          if (file.src && (file.mediatype || file.mediaType)) {
            tokenDataWithMetadata.mediaTypes.push(file.mediatype || file.mediaType)
            tokenDataWithMetadata.mediaUrls.push(this.toIpfsUrl(file.src))
          }
        });
      }
      if (metaData['image']) {
        tokenDataWithMetadata.mediaTypes.push('image')
        tokenDataWithMetadata.mediaUrls.push(this.toIpfsUrl(metaData['image']))
      }
      if (metaData['audio']) {
        tokenDataWithMetadata.mediaTypes.push('audio')
        tokenDataWithMetadata.mediaUrls.push(this.toIpfsUrl(metaData['audio']))
      }
      if (metaData['video']) {
        tokenDataWithMetadata.mediaTypes.push('video')
        tokenDataWithMetadata.mediaUrls.push(this.toIpfsUrl(metaData['video']))
      }

      if (tokenDataWithMetadata.mediaTypes.length === 0) {
        let foundImage = this.findAnyIpfsUrl(metaData)
        if (foundImage) {
          tokenDataWithMetadata.mediaTypes.push('image')
          tokenDataWithMetadata.mediaUrls.push(this.toIpfsUrl(foundImage))
        }
      }

      // assign metadata
      tokenDataWithMetadata.metaDataObject = metaData;
    }

    /*     if (element.tokenRegistryMetadata?.logo) {
          tokenDataWithMetadata.mediaTypes.push('image')
          tokenDataWithMetadata.mediaUrls.push(this.toIpfsUrl("data:image/gif;base64," + element.tokenRegistryMetadata.logo))
        } */

    // return enhanced
    return tokenDataWithMetadata;
  }

  ipfsProviders = [
    //'https://ipfs.io/ipfs/',
    //'https://ipfs.blockfrost.dev/ipfs/',
    'https://cardano-tools.io/ipfs/',
    //'https://infura-ipfs.io/ipfs/',
  ]

  pullRandomIpfsProvider() {
    return this.ipfsProviders[Math.floor(Math.random() * this.ipfsProviders.length)]
  }

  toIpfsUrl(ipfs: string) {
    if (Array.isArray(ipfs)) {
      ipfs = ipfs.join("")
    }

    if ((ipfs as string).startsWith('data:')) {
      // return this.sanitizer.bypassSecurityTrustResourceUrl(ipfs) as string;
      return ipfs;
    }

    if ((ipfs as string).startsWith('http')) {
      return ipfs;
    }

    return this.pullRandomIpfsProvider() + ipfs.replace("ipfs://ipfs/", "").replace("ipfs://", "").replace("ipfs/", "");
  }

  findAnyIpfsUrl(object: any): any {
    for (let key in object) {
      let value = object[key];
      if (value !== null && typeof (value) == "object") {
        let result = this.findAnyIpfsUrl(value);
        if (result) {
          return result
        }
      } else {
        if (value.substring && (value.startsWith("ipfs") || value.startsWith("Qm") || value.startsWith("data:"))) {
          return value;
        }
      }
    }
  }

}
