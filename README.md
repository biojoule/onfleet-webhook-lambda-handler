
# onfleet-webhook-lambda-handler

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

A helpful wrapper for AWS Lambda functions called by Onfleet webhooks, providing transparent [webhook verification](https://docs.onfleet.com/reference/validation) and [signature authentication](https://docs.onfleet.com/reference/secrets).

## Description

### Onfleet validation

This handler will respond to `GET` validation requests with:

```json
{
    statusCode: 200,
    body: event.queryStringParameters?.check,
}
```

### Signature verification

It will verify the integrity of `POST` requests using the `event.headers["x-onfleet-signature"]` and your Onfleet API secret.

## Getting Started

### Installing

```shell
# npm (one of the below, depending on your package manager)
npx jsr add @biojoule/onfleet-webhook-lambda-handler
yarn dlx jsr add @biojoule/onfleet-webhook-lambda-handler
pnpm dlx jsr add @biojoule/onfleet-webhook-lambda-handler
bunx jsr add @biojoule/onfleet-webhook-lambda-handler

# deno
deno add @biojoule/onfleet-webhook-lambda-handler
```

### Usage

#### JavaScript

```javascript
const { webhookHandler } = require("@biojoule/onfleet-webhook-lambda-handler");

const secret = process.env.ONFLEET_WEBHOOK_SECRET

exports.handler = webhookHandler(
    secret,
    async (event, ctx) => {
      return {
        statusCode: 200,
        body: "Hello, Onfleet!"
      }
    }
  )
```

#### TypeScript

```typescript
import { webhookHandler } from "@biojoule/onfleet-webhook-lambda-handler";

const secret = process.env.ONFLEET_WEBHOOK_SECRET

export const handler = webhookHandler(
    secret,
    async (event, ctx) => {
      return {
        statusCode: 200,
        body: "Hello, Onfleet!"
      }
    }
  )
```

## Contributors

<a href="https://github.com/biojoule/onfleet-webhook-lambda-handler/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=biojoule/onfleet-webhook-lambda-handler" />
</a>

## Version History

* 0.1.4
  * Update dependencies.
* 0.1.3
  * Pinned dependencies to safe and cooled down versions.
* 0.1.2
  * Moved `@types/aws-lambda` to the `dependencies` as per the [installation instructions](https://www.npmjs.com/package/@types/aws-lambda).
* 0.1.0
  * Migration to TypeScript.
  * Addition of unit tests.
  * Publication to JSR.
* 0.0.3
  * Minor fix.
* 0.0.2
  * Addition of the Onfleet API secret as a parameter.
* 0.0.1
  * Initial Release.

## License

This project is licensed under the MIT License - see the LICENSE.txt file for details.

## Acknowledgments

[Onfleet node SDK](https://github.com/onfleet/node-onfleet)

[contributors-shield]: https://img.shields.io/github/contributors/biojoule/onfleet-webhook-lambda-handler.svg?style=for-the-badge
[contributors-url]: https://github.com/biojoule/onfleet-webhook-lambda-handler/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/biojoule/onfleet-webhook-lambda-handler.svg?style=for-the-badge
[forks-url]: https://github.com/biojoule/onfleet-webhook-lambda-handler/network/members
[stars-shield]: https://img.shields.io/github/stars/biojoule/onfleet-webhook-lambda-handler.svg?style=for-the-badge
[stars-url]: https://github.com/biojoule/onfleet-webhook-lambda-handler/stargazers
[issues-shield]: https://img.shields.io/github/issues/biojoule/onfleet-webhook-lambda-handler.svg?style=for-the-badge
[issues-url]: https://github.com/biojoule/onfleet-webhook-lambda-handler/issues
[license-shield]: https://img.shields.io/github/license/biojoule/onfleet-webhook-lambda-handler.svg?style=for-the-badge
[license-url]: https://github.com/biojoule/onfleet-webhook-lambda-handler/blob/master/LICENSE.txt
