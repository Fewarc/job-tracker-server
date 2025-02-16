import { extendType, nonNull, objectType, stringArg } from "nexus";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

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
        let user: User | null = null;
        let token;

        try {
          const { name, email, password } = args;
          const hashedPassword = await bcrypt.hash(password, 10);

          user = await context.db.user.create({
            data: { name, email, password: hashedPassword },
          });

          token = jwt.sign({ userId: user.id }, process.env.APP_SECRET!);
        } catch (error) {
          console.error(error);
        }

        return { ...user, jwt: token };
      },
    });
  },
});
