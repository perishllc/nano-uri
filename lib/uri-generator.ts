import { encode, decode } from "js-base64";
import { tools } from "nanocurrency-web";

export default class URIGenerator {

  static handoffBlob(options: any, privateKey?: string) {

    let {
      account = undefined,
      label = "",
      message = "",
      amount = "1000000000000000000000000000000",
      methods = undefined,
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
      signature: undefined as string | undefined,
    };

    let requestSignature: string | undefined;
    if (privateKey != null) {
      request.signature = tools.sign(privateKey, JSON.stringify(request));
    }

    let base64Blob = encode(JSON.stringify(request));
    return base64Blob;
  }


  static handoff(options: any, privateKey?: string) {
    let base64EncodedBlob = this.handoffBlob(options);
    return `nanopay:${base64EncodedBlob}`;

  }

  static authBlob(options: any, privateKey?: string) {
    let {
      account = undefined,
      nonce = "nonce:" + Math.random(), // NOT SECURE PLEASE OVERRIDE
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

    let requestSignature: string | undefined;
    if (privateKey != null) {
      request.signature = tools.sign(privateKey, JSON.stringify(request));
    }
  
    let base64Blob = encode(JSON.stringify(request));
    return base64Blob;
  }

  static auth(options: any, privateKey?: string) {
    let base64EncodedBlob = this.authBlob(options);
    return `nanoauth:${base64EncodedBlob}`;
  }

}