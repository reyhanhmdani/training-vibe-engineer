import { Elysia } from "elysia";

export const authMiddleware = (app: Elysia) =>
    app
        .onBeforeHandle(({ headers, set }) => {
            const auth = headers.authorization;
            if (!auth || !auth.startsWith("Bearer ")) {
                set.status = 401;
                return { error: "Unauthorized" };
            }
        })
        .derive(({ headers }) => {
            const auth = headers.authorization!;
            const token = auth.split(" ")[1];
            return {
                token
            };
        });
