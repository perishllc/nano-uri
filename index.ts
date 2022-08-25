import URIGenerator from "./lib/uri-generator";

import { tools } from "nanocurrency-web";

const generate = {
  handoffBlob: (options: any, privateKey?: string): string => {
    return URIGenerator.handoffBlob(options, privateKey);
  },
  handoff: (options: any, privateKey?: string): string => {
    return URIGenerator.handoff(options, privateKey);
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
};

const verify = {
  auth: (options: any, privateKey?: string): boolean => {

    return URIGenerator.verifyAuth(options, privateKey);
  },
};

export { generate, verify };
