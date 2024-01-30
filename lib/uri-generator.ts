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

export default class URIGenerator {
  static payBlob(options: any, privateKey?: string): string {
    let {
      account = undefined,
      label = "",
      message = "",
      amount = undefined,
      method = undefined,
      exact = true,
      work = true,
      metadata = {},
    } = options;

    if (!account) {
      throw new Error("account is required");
    }
    if (!method) {
      throw new Error("method is required");
    }
    if (!amount) {
      throw new Error("amount is required");
    }

    let request = {
      account: account,
      label: label,
      message: message as string | undefined,
      method: method,
      amount: amount,
      exact,
      work,
      signature: undefined as string | undefined,
      metadata: metadata as any | undefined,
    };

    if (privateKey != null) {
      request.signature = tools.sign(privateKey, JSON.stringify(request));
    }

    let base64Blob = encode(JSON.stringify(request));
    return base64Blob;
  }

  static pay(options: any, privateKey?: string): string {
    let base64EncodedBlob = this.payBlob(options, privateKey);
    return `nanopay:${base64EncodedBlob}`;
  }

  static authBlob(options: any, privateKey?: string): string {
    let {
      account = undefined,
      label = "Login with your NANO Account",
      message = "See this content after login",
      timestamp = Date.now(),
      method = undefined,
      separator = ":",
      metadata = {},
    } = options;

    if (!account) {
      throw new Error("account is required");
    }
    if (!method) {
      throw new Error("method is required");
    }
    if (!label) {
      throw new Error("label is required");
    }

    let request = {
      account: account,
      label: label,
      message: message as string | undefined,
      timestamp: timestamp,
      method: method,
      separator: separator,
      signature: undefined as string | undefined,
      metadata: metadata as any | undefined,
    };

    if (privateKey != null) {
      request.signature = tools.sign(privateKey, JSON.stringify(request));
    }

    let base64Blob = encode(JSON.stringify(request));
    return base64Blob;
  }

  static auth(options: any, privateKey?: string): string {
    let base64EncodedBlob = this.authBlob(options, privateKey);
    return `nanoauth:${base64EncodedBlob}`;
  }

  static nano(options: any): string {
    if (!options.account) {
      throw new Error("account is required");
    } else if (!options.amount) {
      throw new Error("amount is required");
    }

    let nanoStr = `nano:${options.account}`;
    nanoStr += `?amount=${options.amount}`;

    if (options.label) {
      nanoStr += `&label=${options.label}`;
    }

    if (options.message) {
      nanoStr += `&message=${options.message}`;
    }

    return nanoStr;
  }
}
