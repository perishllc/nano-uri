# nano-uri

[![npm version](https://badge.fury.io/js/nanocurrency-web.svg)](https://badge.fury.io/js/nanocurrency-web)
[![GitHub license](https://img.shields.io/github/license/perishllc/nano-uri)](https://github.com/numsu/nanocurrency-web-js/blob/master/LICENSE)

Tools for creating nanopay and nanoauth URIs.

## Features

* Generate `nanopay` and `nanoauth` uri schemes

---

## Installation
### From NPM

```console
npm install nano-uri
```
### In web

```html
<script src="https://unpkg.com/nano-uri@1.0.0" type="text/javascript"></script>
<script type="text/javascript">
    NanoURI.generate.auth(...);
</script>
```

## Usage

| WARNING: do not use any of the private keys or addresses listed below to send real assets! |
| --- |

#### Creating a Block handoff request

```javascript
import { generate } from 'nano-uri'

const data = {
    // @required account: Where the user should send funds to:
    account: "nano_3yxcenuujnn6x7xmg7frakdm5zqu7418n3udquhpqda53oebata1ne9ukipg",

    // @required methods: A list of supported methods to handoff the block to:
    // Nautilus currently only supports the "http" method (POST)
    methods: [
      {
        type: "http",
        url: "https://nautilus.perish.co/handoff"
      }
    ],

    // @required amount: The amount of NANO to send
    amount: "1000000000000000000000000000000",

    // @optional label: What the transaction is for
    label: "Block handoff test",

    // @optional message:
    message: "Block handoff example",
}

// privateKey of the account that is requesting payment
const privateKey = "75E96A80812E6D7B2B9802AB50B8D8E2628EC98C2A3894978F776652BC7B7F01"

// Returns a correctly formatted and signed nanopay:<base64Encoded> URI
const requestURI = generate.handoff(data, privateKey)

// Alternatively, you can use a backwards compatible format by generating the blob the same way, and then adding it as a URI parameter like so:
// note that if put into a QR code it can be hard to scan depending on the size, so it's recommended to only use this in the form of a clickable link:
const handoffBlob = generate.handoffBlob(data, privateKey)
const requestURI = `${generate.nano(data)}&handoff=${handoffBlob}`
```

#### Creating an Authentication request

```javascript
import { generate } from 'nano-uri'

const data = {
    // @required account: Who is requesting the authentication:
    account: "nano_3yxcenuujnn6x7xmg7frakdm5zqu7418n3udquhpqda53oebata1ne9ukipg",

    // @required methods: A list of supported methods to handoff the block to:
    // Nautilus currently only supports the "http" method (POST)
    methods: [
      {
        type: "http",
        url: "https://nautilus.perish.co/auth"
      }
    ],

    // @optional label: What the authentication request is for:
    label: "Login with your NANO Account",

    // @optional message:
    message: "See this content after login",

    // @optional format: how to sign the response:
    format = ["nonce", "timestamp", "label", "account"],

    // @optional separator: separator to use in the format when signing the response:
    separator = ":",
}

// privateKey of the account that is requesting authentication
const privateKey = "75E96A80812E6D7B2B9802AB50B8D8E2628EC98C2A3894978F776652BC7B7F01"

// Returns a correctly formatted and signed nanopay:<base64Encoded> URI
const requestURI = generate.auth(data, privateKey)

// Alternatively, you can use a backwards compatible format by generating the blob the same way, and then adding it as a URI parameter like so:
// note that if put into a QR code it can be hard to scan depending on the size, so it's recommended to only use this in the form of a clickable link:
const handoffBlob = generate.authBlob(data, privateKey)
const requestURI = `${generate.nano(data)}&auth=${handoffBlob}`
```

## Donate

If this project helped you, feel free to donate at the Nautilus Node's address:
`nano_38713x95zyjsqzx6nm1dsom1jmm668owkeb9913ax6nfgj15az3nu8xkx579`