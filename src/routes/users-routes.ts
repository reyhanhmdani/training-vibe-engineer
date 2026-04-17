import { Elysia, t } from "elysia";
import { registerUser } from "../services/users-services";

export const usersRoutes = new Elysia({ prefix: "/api" })
    .post("/users", async ({ body, set }) => {
        try {
            const message = await registerUser(body);
            return { data: message };
        } catch (error: any) {
            if (error.message === "User already exists") {
                set.status = 400; // Or 409 Conflict
                return { error: error.message };
            }
            set.status = 500;
            return { error: "Internal Server Error" };
        }
    }, {
        body: t.Object({
            name: t.String(),
            email: t.String({ format: 'email' }),
            password: t.String()
        })
    });
