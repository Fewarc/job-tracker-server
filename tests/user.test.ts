import { User } from "@prisma/client";
import { createTestContext } from "./__helpers";

const ctx = createTestContext();

const TEST_USERNAME = "signup_user_name";
const TEST_EMAIL = "signup_user_email" + new Date().getTime();
const TEST_PASSWORD = "signup_user_password";

it("ensures that user can be craeted", async () => {
  const userSignupResult: { signupUser: User & { jwt: string } } =
    await ctx.client.request(
      `
    mutation SignupUser($name: String!, $email: String!, $password: String!) {
    signupUser(name: $name, email: $email, password: $password) {
      id
      name
      email
      jwt
    }
  }`,
      { name: TEST_USERNAME, email: TEST_EMAIL, password: TEST_PASSWORD }
    );

  console.log(userSignupResult);

  expect(userSignupResult.signupUser.id).not.toBeNull();
  expect(userSignupResult.signupUser.name).toBe(TEST_USERNAME);
  expect(userSignupResult.signupUser.email).toBe(TEST_EMAIL);
  expect(userSignupResult.signupUser.jwt).not.toBeNull();

  expect(userSignupResult).toMatchInlineSnapshot(`
{
  "signupUser": {
    "email": "signup_user_email1739733933857",
    "id": 12,
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3Mzk3MzM5MzV9.ntIyYPwxdfHX8sbktE2EWYZWrrSLvLe-_ccuDxEZBaA",
    "name": "signup_user_name",
  },
}
`);
});
