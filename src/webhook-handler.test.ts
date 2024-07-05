import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { anyFunction, mock } from "jest-mock-extended";
import { webhookHandler } from "./webhook-handler";

describe("webhook-handler", () => {
  test("should validate GET request", async () => {
    // Arrange
    const secret = Buffer.from("some-secret", "utf-8").toString("hex");
    const check = "some-check";
    const handler = jest.fn();
    const event = mock<APIGatewayProxyEventV2>({
      requestContext: {
        http: {
          method: "GET",
        },
      },
      queryStringParameters: {
        check,
      },
    });
    const context = mock<Context>();

    // Act
    const result = await webhookHandler(secret, handler)(
      event,
      context,
      () => {},
    );

    // Assert
    expect(result).toEqual({
      statusCode: 200,
      body: check,
    });
    expect(handler).not.toHaveBeenCalled();
  });

  test("should call handler", async () => {
    // Arrange
    const secret = Buffer.from("some-secret", "utf-8").toString("hex");
    const expectedResult = "some-result";
    const handler = jest.fn(() => Promise.resolve(expectedResult));
    const event = mock<APIGatewayProxyEventV2>({
      requestContext: {
        http: {
          method: "POST",
        },
      },
      headers: {
        "x-onfleet-signature":
          "542013bd0f97f4b51d7977d33aea6b9ad97585c76d5ad3f3a294ce679560cd3f846144e5e74da79597c16663830b9720bf7d9bb58c88d2acd989bcc1000027fb",
      },
      body: "some-body",
    });
    const context = mock<Context>();

    // Act
    const result = await webhookHandler(secret, handler)(
      event,
      context,
      () => {},
    );

    // Assert
    expect(result).toEqual(expectedResult);
    expect(handler).toHaveBeenCalledWith(event, context, anyFunction());
  });

  test("should fail if event body is undefined", async () => {
    // Arrange
    const secret = Buffer.from("some-secret", "utf-8").toString("hex");
    const handler = jest.fn();
    const event = mock<APIGatewayProxyEventV2>({
      requestContext: {
        http: {
          method: "POST",
        },
      },
      body: undefined,
    });
    const context = mock<Context>();

    // Act & Assert
    await expect(
      webhookHandler(secret, handler)(event, context, () => {}),
    ).rejects.toThrow(new Error("No body in event"));
    expect(handler).not.toHaveBeenCalled();
  });

  test("should fail if signature header is undefined", async () => {
    // Arrange
    const secret = Buffer.from("some-secret", "utf-8").toString("hex");
    const handler = jest.fn();
    const event = mock<APIGatewayProxyEventV2>({
      requestContext: {
        http: {
          method: "POST",
        },
      },
      headers: { "x-onfleet-signature": undefined },
    });
    const context = mock<Context>();

    // Act & Assert
    await expect(
      webhookHandler(secret, handler)(event, context, () => {}),
    ).rejects.toThrow(new Error("No signature in headers"));
    expect(handler).not.toHaveBeenCalled();
  });

  test("should fail if signature is invalid", async () => {
    // Arrange
    const secret = Buffer.from("some-secret", "utf-8").toString("hex");
    const handler = jest.fn();
    const event = mock<APIGatewayProxyEventV2>({
      requestContext: {
        http: {
          method: "POST",
        },
      },
      headers: { "x-onfleet-signature": "some-bogus-signature" },
      body: "some-body",
    });
    const context = mock<Context>();

    // Act
    const result = await webhookHandler(secret, handler)(
      event,
      context,
      () => {},
    );

    // Assert
    expect(result).toEqual({
      statusCode: 401,
      body: "Unauthorized",
    });
    expect(handler).not.toHaveBeenCalled();
  });
});
