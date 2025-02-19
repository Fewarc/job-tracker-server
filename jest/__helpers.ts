import { ServerInfo } from "apollo-server";
import getPort, { makeRange } from "get-port";
import { GraphQLClient } from "graphql-request";
import { testServer } from "../src/server";

type TestContext = {
  client: GraphQLClient;
};

/**
 * Creates graphql test context. Creates multiple servers on random ports
 *
 * @returns { before(): Promise<GraphQLClient>; after(): Promise<void>; }
 */
function graphqlTestContext() {
  let serverInstance: ServerInfo | null = null;

  return {
    async before() {
      // get random port
      const port = await getPort({ port: makeRange(4000, 6000) });

      console.log("TEST SERVER STARTED AT PORT: ", `http://localhost:${port}`);
      // start server
      serverInstance = await testServer.listen({ port });

      // add pre-configured graphql client
      return new GraphQLClient(`http://localhost:${port}`);
    },
    async after() {
      // stop graphql server after each test
      serverInstance?.server.close();
    },
  };
}

/**
 * Creates test context, returns object containing configured GraphQL client to easily send queries to server
 *
 * @returns { TestContext }
 */
export function createTestContext(): TestContext {
  const ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext();

  // // run before each test
  // beforeEach(async () => {
  //   const client = await graphqlCtx.before();
  //   Object.assign(ctx, {
  //     client,
  //   });
  // });

  // // run after each test
  // afterEach(async () => {
  //   await graphqlCtx.after();
  // });

  // run before all tests
  beforeAll(async () => {
    const client = await graphqlCtx.before();
    Object.assign(ctx, {
      client,
    });
  });

  // run after all tests
  afterAll(async () => {
    await graphqlCtx.after();
  });

  return ctx;
}
