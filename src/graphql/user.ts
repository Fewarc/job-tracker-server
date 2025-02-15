import { extendType, nonNull, objectType, stringArg } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("name");
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
    t.nullable.field("createUser", {
      type: "User",
      args: {
        username: nonNull(stringArg()),
      },
      resolve: async (_root, args, context) => {
        let user = null;

        try {
          user = await context.db.user.create({
            data: { name: args.username },
          });
        } catch (error) {
          console.error(error);
        }

        return user;
      },
    });
  },
});
