import { IncomingMessage } from "http";
import { authorizeRequest } from "./utils";

export type GraphQLIncomingMessage = IncomingMessage & {
  body: { operationName: string };
};

const SKIP_AUTH_OPERATIONS = ["SignupUser", "LoginUser", "IntrospectionQuery"];

export const logMiddleware = (req: GraphQLIncomingMessage) => {
  console.log(req.headers);
  console.log(req.body);
};

export const authMiddleware = (req: GraphQLIncomingMessage) => {
  if (!SKIP_AUTH_OPERATIONS.includes(req.body.operationName)) {
    return authorizeRequest(req);
  }
};
