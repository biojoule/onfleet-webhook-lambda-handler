import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";
import { verifySignature } from "./verify-signature";

export type OnfleetWebhookHandler = (
  event: APIGatewayProxyEventV2,
  context: Context,
) => Promise<APIGatewayProxyResultV2>;

export function webhookHandler(
  onfleetApiSecret: string,
  handler: OnfleetWebhookHandler,
): OnfleetWebhookHandler {
  return async (event, context) => {
    // WebHook validation
    // https://docs.onfleet.com/reference/validation
    if (event.requestContext.http.method == "GET") {
      return {
        statusCode: 200,
        body: event.queryStringParameters?.check,
      };
    }

    if (!event.body) throw new Error("No body in event");
    if (!event.headers["x-onfleet-signature"])
      throw new Error("No signature in headers");

    // WebHook authentication
    // https://docs.onfleet.com/reference/secrets
    const validSignature = verifySignature(
      onfleetApiSecret,
      event.body,
      event.headers["x-onfleet-signature"],
    );
    if (!validSignature) {
      return {
        statusCode: 401,
        body: "Unauthorized",
      };
    }

    return handler(event, context);
  };
}
