import { createTestContext } from "./__helpers";
import { NexusGenFieldTypes } from "../nexus-typegen";

const ctx = createTestContext();

const SIGNUP_TEST_USERNAME = "signup_user_name";
const SIGNUP_TEST_EMAIL = "signup_user_email" + new Date().getTime();
const SIGNUP_TEST_PASSWORD = process.env.SIGNUP_TEST_PASSWORD!;

it("ensures that user can be craeted", async () => {
  const userSignupResult: NexusGenFieldTypes["Mutation"] =
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
      {
        name: SIGNUP_TEST_USERNAME,
        email: SIGNUP_TEST_EMAIL,
        password: SIGNUP_TEST_PASSWORD,
      }
    );

  expect(userSignupResult?.signupUser?.id).not.toBeNull();
  expect(userSignupResult?.signupUser?.name).toBe(SIGNUP_TEST_USERNAME);
  expect(userSignupResult?.signupUser?.email).toBe(SIGNUP_TEST_EMAIL);
  expect(userSignupResult?.signupUser?.jwt).not.toBeNull();

  expect(userSignupResult).toMatchInlineSnapshot(`
{
  "signupUser": {
    "email": "signup_user_email1739738620798",
    "id": 34,
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM0LCJpYXQiOjE3Mzk3Mzg2MjF9.0AhT568Xv4eF1eJ_6qsFfMR64kiObBnNflszDBgd7-o",
    "name": "signup_user_name",
  },
}
`);
});

it("ensures that previously created user can log in", async () => {
  const userLoginResult: NexusGenFieldTypes["Mutation"] =
    await ctx.client.request(
      `
    mutation LoginUser($name: String!, $email: String!, $password: String!) {
  loginUser(name: $name, email: $email, password: $password) {
    id
    name
    email
    jwt
  }
}`,
      {
        name: SIGNUP_TEST_USERNAME,
        email: SIGNUP_TEST_EMAIL,
        password: SIGNUP_TEST_PASSWORD,
      }
    );

  expect(userLoginResult?.loginUser?.id).not.toBeNull();
  expect(userLoginResult?.loginUser?.name).toBe(SIGNUP_TEST_USERNAME);
  expect(userLoginResult?.loginUser?.email).toBe(SIGNUP_TEST_EMAIL);
  expect(userLoginResult?.loginUser?.jwt).not.toBeNull();

  expect(userLoginResult).toMatchInlineSnapshot(`
{
  "loginUser": {
    "email": "signup_user_email1739738620798",
    "id": 34,
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM0LCJpYXQiOjE3Mzk3Mzg2MjJ9.9vEYu97XeTrYafL4LvzF8aNEYutEWu_Frsewwj8AFa4",
    "name": "signup_user_name",
  },
}
`);
});

const LOGIN_TEST_USERNAME = "test_user_name";
const LOGIN_TEST_EMAIL = "test_user_email";
const LOGIN_TEST_PASSWORD = process.env.LOGIN_TEST_PASSWORD!;

it("ensures that any user can log in", async () => {
  const userLoginResult: NexusGenFieldTypes["Mutation"] =
    await ctx.client.request(
      `
    mutation LoginUser($name: String!, $email: String!, $password: String!) {
  loginUser(name: $name, email: $email, password: $password) {
    id
    name
    email
    jwt
  }
}`,
      {
        name: LOGIN_TEST_USERNAME,
        email: LOGIN_TEST_EMAIL,
        password: LOGIN_TEST_PASSWORD,
      }
    );

  expect(userLoginResult?.loginUser?.id).not.toBeNull();
  expect(userLoginResult?.loginUser?.name).toBe(LOGIN_TEST_USERNAME);
  expect(userLoginResult?.loginUser?.email).toBe(LOGIN_TEST_EMAIL);
  expect(userLoginResult?.loginUser?.jwt).not.toBeNull();

  expect(userLoginResult).toMatchInlineSnapshot(`
{
  "loginUser": {
    "email": "test_user_email",
    "id": 0,
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjAsImlhdCI6MTczOTczODYyMn0.AoiFRHS9ceUy5aLZJCluMRSCHFdwqecZAk_51fqLeIU",
    "name": "test_user_name",
  },
}
`);
});
