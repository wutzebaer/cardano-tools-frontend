import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenData, TokenRegistryMetadata, TokenOffer } from 'src/cardano-tools-client';

export interface TokenOfferWithParsedTokenData extends TokenOffer {
  tokenDataParsed: TokenDataWithMetadata
  receivedTokensParsed: TokenDataWithMetadata[]
}

export interface TokenDataWithMetadata extends TokenData {
  metaData: any
  tokenRegistryMetadata: TokenRegistryMetadata
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

  enhanceOffer(offer: TokenOffer): TokenOfferWithParsedTokenData {
    const parsed: TokenOfferWithParsedTokenData = offer as TokenOfferWithParsedTokenData;
    parsed.tokenDataParsed = this.enhanceToken(JSON.parse(offer.tokenData));
    parsed.receivedTokensParsed = this.enhanceTokens(JSON.parse(parsed.address.tokensData));
    return parsed;
  }

  enhanceTokens(tokens: TokenData[]): TokenDataWithMetadata[] {

    let enhancedTokens = tokens.map(element => {
      return this.enhanceToken(element);
    });

    return enhancedTokens
  }

  enhanceToken(element: TokenData): TokenDataWithMetadata {
    // cast element
    let tokenDataWithMetadata = element as TokenDataWithMetadata;
    tokenDataWithMetadata.mediaTypes = []
    tokenDataWithMetadata.mediaUrls = []
    tokenDataWithMetadata.metaData = {}

    // timestamp
    tokenDataWithMetadata.timestamp = new Date((1596491091 + (tokenDataWithMetadata.slotNo - 4924800)) * 1000)

    // find lockdate
    tokenDataWithMetadata.locked = false;
    tokenDataWithMetadata.nft = false;
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
        tokenDataWithMetadata.nft = tokenDataWithMetadata.locked && tokenDataWithMetadata.totalSupply === 1;
      }
      // let policy = JSON.parse(this.account.policy);
      // let slot = policy.scripts[0].slot
      // return new Date((1596491091 + (slot - 4924800)) * 1000)
    }

    // check if transaction metadata present
    if (element.json && element.json !== 'null') {

      // find metadata of token in transaction metadata
      let metaData = JSON.parse(element.json)

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

    if (element.tokenRegistryMetadata?.logo) {
      tokenDataWithMetadata.mediaTypes.push('image')
      tokenDataWithMetadata.mediaUrls.push(this.toIpfsUrl("data:image/gif;base64," + element.tokenRegistryMetadata.logo))
    }

    // return enhanced
    return tokenDataWithMetadata;
  }

  ipfsProviders = [
    //'https://ipfs.io/ipfs/',
    //'https://ipfs.blockfrost.dev/ipfs/',
    'https://ipfs.cardano-tools.io/ipfs/',
    //'https://infura-ipfs.io/ipfs/',
  ]

  pullRandomIpfsProvider() {
    return this.ipfsProviders[Math.floor(Math.random() * this.ipfsProviders.length)]
  }

  toIpfsUrl(ipfs: any) {
    if (Array.isArray(ipfs)) {
      ipfs = ipfs.join("")
    }

    if ((ipfs as string).startsWith('data:')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(ipfs) as string;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pullRandomIpfsProvider() + ipfs.replace("ipfs://ipfs/", "").replace("ipfs://", "").replace("ipfs/", "").replace("https://ipfs.io/", "")) as string;
  }

  toSimpleIpfsUrl(ipfs: any) {
    if (Array.isArray(ipfs)) {
      ipfs = ipfs.join("")
    }

    if ((ipfs as string).startsWith('data:')) {
      return ipfs;
    }

    return this.pullRandomIpfsProvider() + ipfs.replace("ipfs://ipfs/", "").replace("ipfs://", "").replace("ipfs/", "").replace("https://ipfs.io/", "");
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
