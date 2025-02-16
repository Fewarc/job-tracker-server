import { extendType, nonNull, objectType, stringArg } from "nexus";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NexusGenObjects } from "../../nexus-typegen";

export const UserType = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("email");
    t.string("jwt");
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("users", {
      type: "User",
      resolve: (_root, _args, context) => {
        return context.db.user.findMany({ where: { id: { in: [1, 2] } } });
      },
    });
  },
});

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("signupUser", {
      type: "User",
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_root, args, context) => {
        let user: NexusGenObjects["User"] | null = null;

        try {
          const { name, email, password } = args;
          const hashedPassword = await bcrypt.hash(password, 10);

          const createdUser = await context.db.user.create({
            data: { name, email, password: hashedPassword },
          });

          const token = jwt.sign(
            { userId: createdUser.id },
            process.env.APP_SECRET!
          );

          user = {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            jwt: token,
          };
        } catch (error) {
          throw new Error(
            `Error occured while trying to create new user: ${error}`
          );
        }

        return user;
      },
    });
    t.nullable.field("loginUser", {
      type: "User",
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_root, args, context) => {
        const { email, name, password } = args;
        let user: NexusGenObjects["User"] | null = null;

        const foundUser = await context.db.user.findUnique({
          where: { email, name },
        });

        if (!foundUser) {
          throw new Error("User not found");
        }

        const passwordValid = bcrypt.compare(password, foundUser.password);

        if (!passwordValid) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          { userId: foundUser.id },
          process.env.APP_SECRET!
        );

        user = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          jwt: token,
        };

        return user;
      },
    });
  },
});
