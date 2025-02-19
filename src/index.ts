import { context } from "./context";
import { server } from "./server";
import { startStandaloneServer } from "@apollo/server/standalone";

startStandaloneServer(server, { context: async () => context }).then(
  ({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  }
);
