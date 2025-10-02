import { Elysia, t } from "elysia";
import { createUser, profile, updateProfile } from "../controllers/user.controller";

export const userRoutes = new Elysia({
  detail: {
    tags: ["User"],
  },
})
  .post("/api/v1/create-user", createUser, {
    body: t.Object({
      address: t.String({
        minLength: 66,
      }),
    }),
  })
  .post("/api/v1/profile", profile, {
    body: t.Object({
      address: t.String({
        minLength: 66,
      }),
    }),
  })
  .put("/api/v1/update-profile", updateProfile, {
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
