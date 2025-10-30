import { db } from ".";
import { users, reports, checklists, issues, photos } from "./schema";
import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database("sqlite.db");
const dbInstance = drizzle(sqlite);

async function main() {
  console.log("Seeding database...");

  // Clear existing data to prevent duplicates
  await dbInstance.delete(photos);
  await dbInstance.delete(issues);
  await dbInstance.delete(checklists);
  await dbInstance.delete(reports);
  await dbInstance.delete(users);

  const hashedPassword = await bcrypt.hash("password", 10);

  // Create users
  const [staffUser] = await dbInstance
    .insert(users)
    .values({
      name: "Staff User",
      email: "staff@example.com",
      hashedPassword,
      role: "staff",
      department: "housekeeping",
    })
    .returning();

  const [supervisorUser] = await dbInstance
    .insert(users)
    .values({
      name: "Supervisor User",
      email: "supervisor@example.com",
      hashedPassword,
      role: "supervisor",
      department: "housekeeping",
    })
    .returning();

  await dbInstance
    .insert(users)
    .values({
      name: "Manager User",
      email: "manager@example.com",
      hashedPassword,
      role: "manager",
      department: "f-b",
    })
    .returning();

  // Create a report for the staff user
  const [report1] = await dbInstance
    .insert(reports)
    .values({
      userId: staffUser.id,
      shiftType: "morning",
      department: "housekeeping",
      status: "submitted",
      createdAt: new Date(),
    })
    .returning();

  // Add details to the report
  await dbInstance.insert(checklists).values([
    { reportId: report1.id, item: "Clean lobby", status: "completed" },
    { reportId: report1.id, item: "Restock supplies", status: "incomplete" },
  ]);

  await dbInstance.insert(issues).values([
    {
      reportId: report1.id,
      description: "Leaky faucet in room 201",
      isResolved: false,
    },
  ]);

  await dbInstance.insert(photos).values([
    {
      reportId: report1.id,
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      caption: "Evidence of leak",
    },
  ]);

  console.log("Database seeded successfully!");
}

main().catch((e) => {
  console.error("Failed to seed database:", e);
  process.exit(1);
});
