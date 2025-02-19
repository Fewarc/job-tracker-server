import { schema } from "./schema";
import { ApolloServer } from "@apollo/server";

export const server = new ApolloServer({ schema });
