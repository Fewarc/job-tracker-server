import { GraphQLIncomingMessage } from "./middlewares";
import jwt from "jsonwebtoken";

export const authorizeRequest = (req: GraphQLIncomingMessage) => {
  if (!req.headers.authorization) {
    throw new Error("Authorization header not found");
  } else {
    const token = req.headers.authorization.replace("Bearer ", "");

    if (!token.length) {
      throw new Error("Missing token");
    } else {
      try {
        const tokenPayload = jwt.verify(token, process.env.APP_SECRET!);
        return tokenPayload;
      } catch (error) {
        throw new Error(`Couldn't verify token: ${error}`);
      }
    }
  }
};
