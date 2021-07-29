import { DomSanitizer } from '@angular/platform-browser';
import { TokenData, TokenRegistryMetadata } from 'src/cardano-tools-client';
import { Injectable } from '@angular/core';


export interface TokenDataWithMetadata extends TokenData {
  metaData: any
  tokenRegistryMetadata: TokenRegistryMetadata
  mediaTypes: string[]
  mediaUrls: any[]
  lockDate?: Date
  timestamp: Date
  locked: boolean
}

@Injectable({
  providedIn: 'root'
})
export class TokenEnhancerService {

  constructor(private sanitizer: DomSanitizer) { }

  enhanceTokens(tokens: TokenData[]): TokenDataWithMetadata[] {

    let enhancedTokens = tokens.map(element => {

      // cast element
      let tokenDataWithMetadata = element as TokenDataWithMetadata;
      tokenDataWithMetadata.mediaTypes = []
      tokenDataWithMetadata.mediaUrls = []
      tokenDataWithMetadata.metaData = {}

      // timestamp
      tokenDataWithMetadata.timestamp = new Date((1596491091 + (tokenDataWithMetadata.slotNo - 4924800)) * 1000)

      // find lockdate
      if (tokenDataWithMetadata.policy) {
        let policy = JSON.parse(tokenDataWithMetadata.policy);
        if (policy.type === 'all') {
          let minLockDate: Date | undefined = undefined;
          policy.scripts?.forEach((script: any) => {
            if (script.type === 'before') {
              let slot = script.slot
              let lockDate = new Date((1596491091 + (slot - 4924800)) * 1000)
              if (!minLockDate || lockDate < minLockDate) {
                minLockDate = lockDate
              }
            }
          });
          tokenDataWithMetadata.lockDate = minLockDate
          if (minLockDate && minLockDate < new Date()) {
            tokenDataWithMetadata.locked = true;
          }
        }
        // let policy = JSON.parse(this.account.policy);
        // let slot = policy.scripts[0].slot
        // return new Date((1596491091 + (slot - 4924800)) * 1000)
      }

      // check if transaction metadata present
      if (element.json && element.json !== 'null') {

        // find metadata of token in transaction metadata
        let metaData = JSON.parse(element.json)[tokenDataWithMetadata.policyId]?.[tokenDataWithMetadata.name] ?? {}

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
        tokenDataWithMetadata.metaData = metaData;
      }

      // return enhanced
      return tokenDataWithMetadata;
    });

    return enhancedTokens
  }

  toIpfsUrl(ipfs: any) {
    // https://ipfs.io/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://ipfs.blockfrost.dev/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://cloudflare-ipfs.com/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://ipfs.eternum.io/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt

    if (Array.isArray(ipfs)) {
      ipfs = ipfs.join("")
    }

    if ((ipfs as string).startsWith('data:')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(ipfs) as string;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl("https://ipfs.cardano-tools.io/ipfs/" + ipfs.replace("ipfs://ipfs/", "").replace("ipfs://", "").replace("ipfs/", "").replace("https://ipfs.io/", "")) as string;
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
