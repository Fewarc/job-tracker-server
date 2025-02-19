import { context } from "./context";
import { authMiddleware, GraphQLIncomingMessage } from "./middlewares";
import { server } from "./server";
import { startStandaloneServer } from "@apollo/server/standalone";

startStandaloneServer(server, {
  context: async ({ req }) => {
    const userId = authMiddleware(req as GraphQLIncomingMessage);
    return { ...req, ...context, userId };
  },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
