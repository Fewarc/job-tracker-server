import { extendType, objectType } from "nexus";

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
      resolve: (_, __, context) => {
        return context.db.user.findMany({ where: { id: { in: [1, 2, 3] } } });
      },
    });
  },
});
