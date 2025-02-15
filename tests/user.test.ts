import { createTestContext } from "./__helpers";

const ctx = createTestContext();

it("ensures that user can be craeted", async () => {
  const userCreateResult = await ctx.client.request(
    `
    mutation CreateUser($username: String!) {
      createUser(username: $username) {
        id,
        name
      }
    }`,
    { username: "create_user_test" }
  );

  expect(userCreateResult).toMatchInlineSnapshot(`
{
  "createUser": {
    "id": null,
    "name": "create_user_test",
  },
}
`);
});
