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
      methods = undefined,
      exact = true,
      work = true,
      reuse = false,
      metadata = {}
    } = options;

    if (!account) {
      throw new Error("account is required");
    }
    if (!methods) {
      throw new Error("methods is required");
    }
    if (!amount) {
      throw new Error("amount is required");
    }

    let request = {
      account: account,
      label: label,
      message: message as string | undefined,
      methods: methods,
      amount: amount,
      exact,
      work,
      reuse,
      signature: undefined as string | undefined,
      metadata: metadata as any | undefined
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
      nonce = `nonce:${Math.random()}`,
      label = "Login with your NANO Account",
      message = "See this content after login",
      timestamp = Date.now(),
      methods = undefined,
      format = ["nonce", "timestamp", "label", "account"],
      separator = ":",
      metadata = {}
    } = options;

    if (!account) {
      throw new Error("account is required");
    }
    if (!methods) {
      throw new Error("methods is required");
    }

    let request = {
      account: account,
      nonce: nonce,
      label: label,
      message: message as string | undefined,
      timestamp: timestamp,
      methods: methods,
      format: format,
      separator: separator,
      signature: undefined as string | undefined,
      metadata: metadata as any | undefined
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

  static verifyAuth(options: any): boolean {
    if (!options.account) {
      throw new Error("account is required");
    }

    if (!options.signature) {
      throw new Error("signature is required");
    }

    if (!options.signed) {
      throw new Error("signed is required");
    }

    let formatted = String.fromCharCode(...hex2ba(options.signed));

    if (!!options.formatted) {
      if (options.formatted != formatted) {
        throw new Error("formatted != signed");
      }
    }

    let signed = hex2ba(options.signed);
    let signature = hex2ba(options.signature);
    let publicKey = hex2ba(tools.addressToPublicKey(options.account));
    let isValid = nacl.sign.detached.verify(signed, signature, publicKey);

    return isValid;
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

  static subBlob(options: any, privateKey?: string): string {
    let {
      account = undefined,
      label = "",
      message = "",
      frequency = undefined,
      amount = undefined,
      metadata = {}
    } = options;

    if (!account) {
      throw new Error("account is required");
    }
    if (!amount) {
      throw new Error("amount is required");
    }
    if (!frequency) {
      throw new Error("frequency is required");
    }

    let request = {
      account: account,
      label: label,
      message: message as string | undefined,
      frequency: frequency,
      amount: amount,
      signature: undefined as string | undefined,
      metadata: metadata as any | undefined
    };

    if (privateKey != null) {
      request.signature = tools.sign(privateKey, JSON.stringify(request));
    }

    let base64Blob = encode(JSON.stringify(request));
    return base64Blob;
  }

  static sub(options: any, privateKey?: string): string {
    let base64EncodedBlob = this.subBlob(options, privateKey);
    return `nanosub:${base64EncodedBlob}`;
  }
}
