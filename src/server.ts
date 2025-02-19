import { schema } from "./schema";
import { ApolloServer } from "@apollo/server";
import { ApolloServer as TestApolloServer } from "apollo-server";
import { context } from "./context";

export const server = new ApolloServer({ schema });
export const testServer = new TestApolloServer({ schema, context });
