import URIGenerator from "./lib/uri-generator";
import Verifier from "./lib/verifier";
import Signer from "./lib/signer";


const generate = {
  payBlob: (options: any, privateKey?: string): string => {
    return URIGenerator.payBlob(options, privateKey);
  },
  pay: (options: any, privateKey?: string): string => {
    return URIGenerator.pay(options, privateKey);
  },
  authBlob: (options: any, privateKey?: string): string => {
    return URIGenerator.authBlob(options, privateKey);
  },
  auth: (options: any, privateKey?: string): string => {
    return URIGenerator.auth(options, privateKey);
  },
  subBlob: (options: any, privateKey?: string): string => {
    return URIGenerator.subBlob(options, privateKey);
  },
  sub: (options: any, privateKey?: string): string => {
    return URIGenerator.sub(options, privateKey);
  },
  nano: (options: any): string => {
    return URIGenerator.nano(options);
  },
};

const verify = {
  auth: (options: any, privateKey?: string): boolean => {
    return Verifier.auth(options);
  },
};

const signer = {
  auth: (options: any, privateKey?: string): any => {
    return Signer.auth(options, privateKey);
  },
  pay: (options: any, privateKey?: string): any => {
    return Signer.auth(options, privateKey);
  },
};

export { generate, verify, signer };
