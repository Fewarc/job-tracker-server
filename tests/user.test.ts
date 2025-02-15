import { User } from "@prisma/client";
import { createTestContext } from "./__helpers";

const ctx = createTestContext();

const TEST_USERNAME = "create_user_test_username";

it("ensures that user can be craeted", async () => {
  const userCreateResult: { createUser: User } = await ctx.client.request(
    `
    mutation CreateUser($username: String!) {
      createUser(username: $username) {
        id,
        name
      }
    }`,
    { username: TEST_USERNAME }
  );

  expect(userCreateResult.createUser.id).not.toBeNull();
  expect(userCreateResult.createUser.name).toBe(TEST_USERNAME);

  expect(userCreateResult).toMatchInlineSnapshot(`
{
  "createUser": {
    "id": 15,
    "name": "create_user_test_username",
  },
}
`);
});
