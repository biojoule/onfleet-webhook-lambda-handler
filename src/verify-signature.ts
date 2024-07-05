import * as crypto from "crypto";

export function verifySignature(
  secret: string,
  body: string,
  signature: string,
) {
  const secret_buf = Buffer.from(secret, "hex");
  const hash = crypto
    .createHmac("sha512", secret_buf)
    .update(body)
    .digest("hex");
  return hash === signature;
}
