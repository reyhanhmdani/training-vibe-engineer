import { Elysia } from "elysia";
import { db } from "./db";

const app = new Elysia()
    .get("/", () => ({ status: "ok", message: "Elysia + Drizzle is running" }))
    .get("/users", async () => {
        return await db.query.users.findMany();
    })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
