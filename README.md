# nano-uri

[![npm version](https://badge.fury.io/js/nano-uri.svg)](https://badge.fury.io/js/nano-uri)
[![GitHub license](https://img.shields.io/github/license/perishllc/nano-uri)](https://github.com/perishllc/nano-uri/blob/main/LICENSE)

Library for creating nanopay and nanoauth URIs for use with nautilus.

If there are API-level breaking changes to the library, a major version bump (X.0.0) will be made along with a reddit post announcing the change.

Note that Nautilus will only ever try to support the latest version of this library, with as much backwards compatiblity as is reasonable.
That being said, I don't expect all that much to change.


V3.0 Changes!:

The signing format is now FIXED to reduce complexity on implementations:
the signer will now sign in this order!: ["timestamp", "label", "account"],
so with the default separator: ":", a signed message request might look like this:
"1234567:this is for an nft:nano_1234"

## Features

- Easily generate `nanopay` and `nanoauth` URI schemes

## Examples

### Example Link / QR

<a href="nanopay:eyJhY2NvdW50IjoibmFub18zODcxM3g5NXp5anNxeng2bm0xZHNvbTFqbW02Njhvd2tlYjk5MTNheDZuZmdqMTVhejNudTh4a3g1NzkiLCJhbW91bnQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwibGFiZWwiOiJOYXV0aWx1cyBEb25hdGlvbiIsIm1lc3NhZ2UiOiJibG9jayBoYW5kb2ZmIHRlc3QiLCJtZXRob2RzIjpbeyJ0eXBlIjoiaHR0cCIsInVybCI6Imh0dHBzOi8vbmF1dGlsdXMucGVyaXNoLmNvL2hhbmRvZmYifV19">
  <img src="https://imagedelivery.net/uA65-M4gr037oB0C4RNdvw/e98e27b0-6314-4f0b-6ade-142c426dfa00/public" width="225"/>
</a>

### Example Backend Code (js)

This is the format that Nautilus expects as a response:

```javascript
// TODO: finish this

// Example POST JSON responses:
// Example Success:
{
    // 0 = success
    "status": 0,
    "label": "Order #1234 - Example Service",
    "message": "Thank you for your purchase!",
    "metadata": {/* arbitrary transaction metadata */}
}

// Example Error:
{

    "status": int,
    // 0 = success
    // anything other than 0 == error
    "message": "<To be shown to the user explaining what went wrong>",
}


```

## Installation

### From NPM

```console
npm install nano-uri
```

### In web

```html
<script src="https://unpkg.com/nano-uri@2.1.1" type="text/javascript"></script>
<script type="text/javascript">
  NanoURI.generate.auth(...);
  NanoURI.generate.pay(...);
  NanoURI.generate.sub(...);
  NanoURI.verify.auth(...);
</script>
```

## Usage

| WARNING: do not use any of the private keys or addresses listed below to send real assets! |
| ------------------------------------------------------------------------------------------ |

#### Creating a Block handoff request

```javascript
import { generate } from "nano-uri";

const data = {
  // @required account: Where the user should send funds to:
  account: "nano_3yxcenuujnn6x7xmg7frakdm5zqu7418n3udquhpqda53oebata1ne9ukipg",

  // @required method: how to handoff the block:
  // Nautilus currently only supports the "post" method (HTTP POST)
  method: {
    type: "post",
    subtype: "handoff",
    url: "https://nautilus.perish.co/handoff",
  },

  // @required amount: The amount of NANO to send (in RAW):
  amount: "1000000000000000000000000000000",

  // @optional label: What the transaction is for
  label: "Block handoff test",

  // @optional message:
  message: "Thank you for using Nautilus!",

  // @optional exact: (default: true), whether the amount must match exactly
  // if false, amounts >= amount will be accepted
  exact: true,

  // @optional work: (default: true), whether the endpoint supports work generation
  // if false, the wallet must provide the work for the block by some other means (CURRENTLY UNSUPPORTED IN NAUTILUS)
  work: true,

  // @optional metadata: (default: {}), arbitrary metadata to be included in the response
  metadata: {
    order_id: "1234",
    service: "Example Service",
  },
};

// @optional: privateKey of the account that is requesting payment, to sign the request:
const privateKey = "75E96A80812E6D7B2B9802AB50B8D8E2628EC98C2A3894978F776652BC7B7F01";

// Returns a correctly formatted and signed nanopay:<base64Encoded> URI
const requestURI = generate.pay(data, privateKey);

// Alternatively, you can use a backwards compatible format by generating the blob the same way, and then adding it as a URI parameter like so:
// note that if put into a QR code it can be hard to scan depending on the size, so it's recommended to only use this in the form of a clickable link:
const payBlob = generate.payBlob(data, privateKey);
const requestURI = `${generate.nano(data)}&pay=${payBlob}`;
```

#### Creating an Authentication request

```javascript
import { generate } from "nano-uri";

const data = {
  // @required method: how to handoff the block:
  // Nautilus currently only supports the "post" method (HTTP POST)
  method: {
    type: "post",
    subtype: "handoff",
    url: "https://nautilus.perish.co/handoff",
  },

  // @required account: Who is requesting the authentication:
  account: "nano_3yxcenuujnn6x7xmg7frakdm5zqu7418n3udquhpqda53oebata1ne9ukipg",

  // @required label: What the authentication request is for:
  label: "Login with your NANO Account",

  // @optional message:
  message: "See this content after login",

  // @optional separator: separator to use in the format when signing the response:
  // default:
  separator: ":",

  // @optional metadata: (default: {}), arbitrary metadata to be included in the response
  metadata: {
    order_id: "1234",
    service: "Example Service",
  },
};

// @optional: privateKey of the account that is requesting authentication, to sign the request:
const privateKey = "75E96A80812E6D7B2B9802AB50B8D8E2628EC98C2A3894978F776652BC7B7F01";

// Returns a correctly formatted and signed nanoauth:<base64Encoded> URI
const requestURI = generate.auth(data, privateKey);

// Alternatively, you can use a backwards compatible format by generating the blob the same way, and then adding it as a URI parameter like so:
// note that if put into a QR code it can be hard to scan depending on the size, so it's recommended to only use this in the form of a clickable link:
const authBlob = generate.authBlob(data, privateKey);
const requestURI = `${generate.nano(data)}&auth=${authBlob}`;
```

#### Verifying an authentication request

```javascript
import { verify } from "nano-uri";

const data = {
  // @required account: whoever signed the request:
  account: "nano_11qwaxtmb5c7xc16wat5rgirbxzug1kgq8tf996xi8kf5cdcrjyaiy39foun",

  // @required signature: signature of the request:
  signature:
    "C1FCCB4092AF1A2683BA3DB0F69FFFC11A961E995C3C10ACFB5F302767E91BB340A1475000AAEDD94E36D45DA0FC91DEEB9B02ABCEF7B98FBF78B5B3B9419D0C",

  // @required signed: the text that was signed:
  signed:
    "736F6D655F72616E646F6D5F6E6F6E63653A313636313339333830303A4C6F67696E20746F205065726973683A6E616E6F5F33383731337839357A796A73717A78366E6D3164736F6D316A6D6D3636386F776B6562393931336178366E66676A3135617A336E7538786B78353739",

  // @optional formatted: the decoded signed text:
  formatted:
    "1589788984:Login with your NANO Account:nano_3yxcenuujnn6x7xmg7frakdm5zqu7418n3udquhpqda53oebata1ne9ukipg",
};

// true if the signature is valid, false otherwise
const isValid = verify.auth(data);
```

#### Creating a Subscription request

```javascript
import { generate } from "nano-uri";

const data = {
  // @required account: Where the user should send funds to:
  account: "nano_3yxcenuujnn6x7xmg7frakdm5zqu7418n3udquhpqda53oebata1ne9ukipg",

  // @required amount: The amount of NANO to send (in RAW):
  amount: "1000000000000000000000000000000",

  // @required frequency: How often the subscription should be paid (cron format):
  frequency: "0 0 1 * *",// every 1st of the month

  // @optional label: What the subscription is for
  label: "Nautilus Pro",

  // @optional message:
  message: "Thank you for using Nautilus!",
};

// @optional: privateKey of the account that is requesting payment, to sign the request:
const privateKey = "75E96A80812E6D7B2B9802AB50B8D8E2628EC98C2A3894978F776652BC7B7F01";

// Returns a correctly formatted and signed nanosub:<base64Encoded> URI
const requestURI = generate.sub(data, privateKey);
```

#### Creating a regular `nano:` URI

```javascript
import { generate } from "nano-uri";

const data = {
  // @required account: Where the user should send funds to:
  account: "nano_3yxcenuujnn6x7xmg7frakdm5zqu7418n3udquhpqda53oebata1ne9ukipg",

  // @required amount: amount in raw
  amount: "1000000000000000000000000000000",

  // @optional label: What the transaction is for
  label: "NANO URI test",

  // @optional message:
  message: "Thank you for using Nautilus!",
};

// Returns a correctly formatted nano: URI
const requestURI = generate.nano(data);
```

## Donate

If this project helped you, feel free to donate at the Nautilus Node's address:
[`nano_38713x95zyjsqzx6nm1dsom1jmm668owkeb9913ax6nfgj15az3nu8xkx579`](https://nano.to/nautilus)
