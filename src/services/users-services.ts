import { db } from "../db";
import { users } from "../db/schema";
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
