import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export const registerUser = async (payload: any) => {
    const { name, email, password } = payload;

    // 1. Check if user already exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // 2. Hash password using Bun's native hashing
    const hashedPassword = await Bun.password.hash(password);

    // 3. Insert new user
    await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
    });

    return "User created successfully";
};

export const loginUser = async (payload: any) => {
    const { email, password } = payload;

    // 1. Find user by email
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user) {
        throw new Error("Email atau password salah");
    }

    // 2. Verify password
    const isPasswordValid = await Bun.password.verify(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Email atau password salah");
    }

    // 3. Generate session token
    const token = crypto.randomUUID();

    // 4. Save session to DB
    await db.insert(sessions).values({
        token,
        userId: user.id,
    });

    return token;
};

export const getCurrentUser = async (token: string) => {
    const session = await db.query.sessions.findFirst({
        where: eq(sessions.token, token),
        with: {
            user: true
        }
    }) as any;

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const { id, name, email, createdAt } = session.user;
    return { id, name, email, createdAt };
};
