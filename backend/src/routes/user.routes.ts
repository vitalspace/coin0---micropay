import { Elysia, t } from "elysia";
import { createUser, profile, updateProfile } from "../controllers/user.controller";

export const userRoutes = new Elysia({
  detail: {
    tags: ["User"],
  },
})
  .post("/create-user", createUser, {
    body: t.Object({
      address: t.String({
        minLength: 66,
      }),
    }),
  })
  .post("/profile", profile, {
    body: t.Object({
      address: t.String({
        minLength: 66,
      }),
    }),
  })
  .put("/update-profile", updateProfile, {
    body: t.Object({
      address: t.String({
        minLength: 66,
      }),
      nickname: t.Optional(
        t.String({
          minLength: 2,
          maxLength: 50,
        })
      ),
      avatar: t.Optional(t.String()),
      bio: t.Optional(t.String()),
    }),
  });
