import { APIGatewayProxyEventV2, Callback, Context, Handler } from "aws-lambda";
import { verifySignature } from "./verify-signature";

export function webhookHandler(
  onfleetApiSecret: string,
  handler: Handler<APIGatewayProxyEventV2>,
): Handler<APIGatewayProxyEventV2> {
  return async (
    event: APIGatewayProxyEventV2,
    context: Context,
    callback: Callback<unknown>,
  ): Promise<unknown> => {
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

    return handler(event, context, callback);
  };
}
