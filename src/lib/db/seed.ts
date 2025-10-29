import { db } from ".";
import { users } from "./schema";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);
  await db.insert(users).values({
    name: "Staff User",
    email: "staff@example.com",
    hashedPassword,
    role: "staff",
    department: "housekeeping",
  });
}

main();
