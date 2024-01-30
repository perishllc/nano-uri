import { tools } from "nanocurrency-web";

import * as nacl from "tweetnacl-blake2b";


function hex2ba(hex: string): Uint8Array {
  const ab = [];
  for (let i = 0; i < hex.length; i += 2) {
    ab.push(parseInt(hex.substr(i, 2), 16));
  }
  return new Uint8Array(ab);
}

export default class Verifier {

  static auth(options: any): boolean {
    if (!options.account) {
      throw new Error("account is required");
    }

    if (!options.signature) {
      throw new Error("signature is required");
    }

    if (!options.signed) {
      throw new Error("signed is required");
    }

    if (!!options.formatted) {
      let formatted = String.fromCharCode(...hex2ba(options.signed));
      if (options.formatted != formatted) {
        throw new Error(`formatted != signed! (formatted: ${options.formatted} signed: ${formatted})`);
      }
    }

    let signed = hex2ba(options.signed);
    let signature = hex2ba(options.signature);
    let publicKey = hex2ba(tools.addressToPublicKey(options.account));
    let isValid = nacl.sign.detached.verify(signed, signature, publicKey);

    return isValid;
  }
}
