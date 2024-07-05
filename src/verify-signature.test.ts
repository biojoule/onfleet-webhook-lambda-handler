import { verifySignature } from "./verify-signature";

describe("verifySignature", () => {
  test("should verify signature", () => {
    // Arrange
    const secret = Buffer.from("some-secret", "utf-8").toString("hex");
    const body = "some-body";
    const signature =
      "542013bd0f97f4b51d7977d33aea6b9ad97585c76d5ad3f3a294ce679560cd3f846144e5e74da79597c16663830b9720bf7d9bb58c88d2acd989bcc1000027fb";

    // Act
    const result = verifySignature(secret, body, signature);

    // Assert
    expect(result).toBe(true);
  });

  test("should not verify bogus signature", () => {
    // Arrange
    const secret = Buffer.from("some-secret", "utf-8").toString("hex");
    const body = "some-body";
    const signature = "some-bogus-signature";

    // Act
    const result = verifySignature(secret, body, signature);

    // Assert
    expect(result).toBe(false);
  });

  test("should not verify signature tampered body", () => {
    // Arrange
    const secret = Buffer.from("some-secret", "utf-8").toString("hex");
    const body = "some-tampered-body";
    const signature =
      "542013bd0f97f4b51d7977d33aea6b9ad97585c76d5ad3f3a294ce679560cd3f846144e5e74da79597c16663830b9720bf7d9bb58c88d2acd989bcc1000027fb";

    // Act
    const result = verifySignature(secret, body, signature);

    // Assert
    expect(result).toBe(false);
  });

  test("should not verify signature tampered secret", () => {
    // Arrange
    const secret = Buffer.from("some-tampered-secret", "utf-8").toString("hex");
    const body = "some-body";
    const signature =
      "542013bd0f97f4b51d7977d33aea6b9ad97585c76d5ad3f3a294ce679560cd3f846144e5e74da79597c16663830b9720bf7d9bb58c88d2acd989bcc1000027fb";

    // Act
    const result = verifySignature(secret, body, signature);

    // Assert
    expect(result).toBe(false);
  });
});
