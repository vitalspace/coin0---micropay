import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import db from "./db/db";
import { userRoutes } from "./routes/user.routes";
import { swapRoutes } from "./routes/swap.routes";
import { SwapService } from "./services/swap.service";

const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.ALLOW_ORIGIN || process.env.ALLOW_ORIGIN2;

db();

// Initialize swap service (no continuous monitoring needed)
// const swapService = new SwapService();

const app = new Elysia()
  .use(
    cors({
      origin: ORIGIN,
      allowedHeaders: ["Content-Type"],
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  )
  .group("/api/v1", (app) => app
    .use(userRoutes)
    // .use(swapRoutes)
  )
  .listen(PORT);

console.log(`Server running on http://localhost:${app.server?.port}`);
