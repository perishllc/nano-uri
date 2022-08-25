import { encode, decode } from "js-base64";
import { tools } from "nanocurrency-web";


function hexStringToByteArray(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
      throw "Must have an even number of hex digits to convert to bytes";
  }
  var numBytes = hexString.length / 2;
  var byteArray = new Uint8Array(numBytes);
  for (var i=0; i<numBytes; i++) {
      byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
  }
  return byteArray;
}


export default class URIGenerator {
  static handoffBlob(options: any, privateKey?: string): string {
    let {
      account = undefined,
      label = "",
      message = "",
      amount = undefined,
      methods = undefined,
      exact = true,
      work = true,
      reuse = false,
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
    };

    if (privateKey != null) {
      request.signature = tools.sign(privateKey, JSON.stringify(request));
    }

    let base64Blob = encode(JSON.stringify(request));
    return base64Blob;
  }

  static handoff(options: any, privateKey?: string): string {
    let base64EncodedBlob = this.handoffBlob(options, privateKey);
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

    if (!options.formatted) {
      throw new Error("formatted is required");
    }

    const publicKey = tools.addressToPublicKey(options.account);


    let formatted = String.fromCharCode(...hexStringToByteArray(options.signed));

    if (options.formatted != formatted) {
      throw new Error("formatted != signed");
    }

    return tools.verify(publicKey, options.signature, options.signed);
  }

  static nano(options: any): string {
    if (!options.account) {
      throw new Error("account is required");
    }

    let nanoStr = `nano:${options.account}`;

    if (options.amount) {
      nanoStr += `?amount=${options.amount}`;
    }

    if (options.label) {
      if (options.amount) {
        nanoStr += "&";
      } else {
        nanoStr += "?";
      }

      nanoStr += `label=${options.label}`;
    }

    if (options.message) {
      if (options.amount || options.label) {
        nanoStr += "&";
      } else {
        nanoStr += "?";
      }

      nanoStr += `message=${options.label}`;
    }

    return nanoStr;
  }


}
