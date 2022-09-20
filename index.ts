import URIGenerator from "./lib/uri-generator";

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
  nano: (options: any): string => {
    return URIGenerator.nano(options);
  },
  // deprecated: use generate.pay
  handoffBlob: (options: any, privateKey?: string): string => {
    return URIGenerator.payBlob(options, privateKey);
  },
  handoff: (options: any, privateKey?: string): string => {
    return URIGenerator.pay(options, privateKey);
  },
};

const verify = {
  auth: (options: any): boolean => {
    return URIGenerator.verifyAuth(options);
  },
};

export { generate, verify };
