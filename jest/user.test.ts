import { createTestContext } from "./__helpers";
import { NexusGenFieldTypes } from "../nexus-typegen";

const ctx = createTestContext();

const SIGNUP_TEST_USERNAME = "signup_user_name";
const SIGNUP_TEST_EMAIL = "signup_user_email" + new Date().getTime();
const SIGNUP_TEST_PASSWORD = process.env.SIGNUP_TEST_PASSWORD!;

let signupTestUserId: number | null | undefined = null;

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

  signupTestUserId = userSignupResult?.signupUser?.id;

  expect(userSignupResult?.signupUser?.name).toBe(SIGNUP_TEST_USERNAME);
  expect(userSignupResult?.signupUser?.email).toBe(SIGNUP_TEST_EMAIL);
  expect(userSignupResult?.signupUser?.jwt).not.toBeNull();

  expect(userSignupResult).toMatchInlineSnapshot(`
{
  "signupUser": {
    "email": "signup_user_email1740004001859",
    "id": 8,
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTc0MDAwNDAwM30.i1xBOiFY70dNOFIdEozvRnYpQxJ0GWcTdH-nQEg2NMM",
    "name": "signup_user_name",
  },
}
`);
});

it("ensures that previously created user can log in", async () => {
  const userLoginResult: NexusGenFieldTypes["Mutation"] =
    await ctx.client.request(
      `
    mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    id
    name
    email
    jwt
  }
}
  `,
      {
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
    "email": "signup_user_email1740004001859",
    "id": 8,
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTc0MDAwNDAwM30.i1xBOiFY70dNOFIdEozvRnYpQxJ0GWcTdH-nQEg2NMM",
    "name": "signup_user_name",
  },
}
`);
});

it("ensures that previously created user can be deleted", async () => {
  expect(signupTestUserId).not.toBeNull();

  const userDeleteResult: NexusGenFieldTypes["Mutation"] =
    await ctx.client.request(
      `
    mutation DeleteUser($deleteUserId: Int!) {
  deleteUser(id: $deleteUserId) {
    id
    name
    email
    jwt
  }
}
  `,
      {
        deleteUserId: signupTestUserId,
      }
    );

  expect(userDeleteResult?.deleteUser?.id).not.toBeNull();
  expect(userDeleteResult?.deleteUser?.name).toBe(SIGNUP_TEST_USERNAME);
  expect(userDeleteResult?.deleteUser?.email).toBe(SIGNUP_TEST_EMAIL);
  expect(userDeleteResult?.deleteUser?.jwt).toBeNull();

  expect(userDeleteResult).toMatchInlineSnapshot(`
{
  "deleteUser": {
    "email": "signup_user_email1740004001859",
    "id": 8,
    "jwt": null,
    "name": "signup_user_name",
  },
}
`);

  const findUserResult: NexusGenFieldTypes["Query"] = await ctx.client.request(
    `
    query FindUser($findUserId: Int!) {
      findUser(id: $findUserId) {
        id
        name
        email
        jwt
      }
    }
  `,
    {
      findUserId: signupTestUserId,
    }
  );

  expect(findUserResult?.findUser?.id).not.toBeNull();
});

const LOGIN_TEST_USERNAME = "test_user_name";
const LOGIN_TEST_EMAIL = "test_user_email";
const LOGIN_TEST_PASSWORD = process.env.LOGIN_TEST_PASSWORD!;

it("ensures that any user can log in", async () => {
  const userLoginResult: NexusGenFieldTypes["Mutation"] =
    await ctx.client.request(
      `
    mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    id
    name
    email
    jwt
  }
}

  `,
      {
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
    "id": 5,
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc0MDAwNDAwNH0.ddkUca0UI1QVIo2iWLgEV8KZ66FMuKNYnOaB70LAPFY",
    "name": "test_user_name",
  },
}
`);
});
