import { extendType, objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.string("name");
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("users", {
      type: "User",
      resolve: () => {
        return [{ id: "1", name: "Username" }];
      },
    });
  },
});
