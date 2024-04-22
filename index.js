const crypto = require('crypto')

function verifySignature({ secret, body, signature }) {
  const secret_buf = Buffer.from(secret, 'hex');
  const hash = crypto.createHmac('sha512', secret_buf)
    .update(body)
    .digest('hex');
  console.log("hash", hash);
  console.log("sig", signature);
  return hash === signature;
}

function webhookHandler(onfleet_api_secret, handler) {
  return async (event, ctx) => {
    // WebHook validation
    // https://docs.onfleet.com/reference/validation
    if (event.requestContext.http.method == "GET") {
      return {
        statusCode: 200,
        body: event.queryStringParameters.check
      }
    }

    // WebHook authentication
    // https://docs.onfleet.com/reference/secrets

    const validSignature = verifySignature({
      secret: onfleet_api_secret,
      body: event.body,
      signature: event.headers['x-onfleet-signature']
    });
    if (!validSignature) {
      return {
        statusCode: 401,
        body: "Unauthorized"
      }
    }

    return handler(event, ctx);
  }
}

module.exports = {
  verifySignature,
  webhookHandler,
}