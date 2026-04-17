import { Elysia, t } from "elysia";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../services/users-services";
import { authMiddleware } from "../middlewares/auth-middleware";

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
    })
    .post("/users/login", async ({ body, set }) => {
        try {
            const token = await loginUser(body);
            return { data: token };
        } catch (error: any) {
            if (error.message === "Email atau password salah") {
                set.status = 401;
                return { error: error.message };
            }
            set.status = 500;
            return { error: "Internal Server Error" };
        }
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String()
        })
    })
    .group("/users", app => app
        .use(authMiddleware)
        .get("/current", async ({ token, set }) => {
            try {
                const user = await getCurrentUser(token!);
                return { data: user };
            } catch (error: any) {
                if (error.message === "Unauthorized") {
                    set.status = 401;
                    return { error: error.message };
                }
                set.status = 500;
                return { error: "Internal Server Error" };
            }
        })
        .delete("/logout", async ({ token, set }) => {
            try {
                const result = await logoutUser(token!);
                return { data: result };
            } catch (error: any) {
                if (error.message === "Unauthorized") {
                    set.status = 401;
                    return { error: error.message };
                }
                set.status = 500;
                return { error: "Internal Server Error" };
            }
        })
    );
