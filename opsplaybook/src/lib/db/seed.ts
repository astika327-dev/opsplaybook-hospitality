import { db } from ".";
import { users } from "./schema";

async function main() {
  await db.insert(users).values({
    name: "Staff User",
    email: "staff@example.com",
    role: "staff",
    department: "housekeeping",
  });
}

main();
