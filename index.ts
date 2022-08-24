
import URIGenerator from "./lib/uri-generator";

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

export {
	generate
}