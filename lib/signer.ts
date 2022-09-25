import { encode, decode } from "js-base64";
import { tools } from "nanocurrency-web";

import * as nacl from "tweetnacl-blake2b";


function hex2ba(hex: string): Uint8Array {
  const ab = [];
  for (let i = 0; i < hex.length; i += 2) {
    ab.push(parseInt(hex.substr(i, 2), 16));
  }
  return new Uint8Array(ab);
}

export default class Signer {

  static auth(options: any, privateKey: string): any {
  }

  static pay(options: any, privateKey: string): any {
  }
}
