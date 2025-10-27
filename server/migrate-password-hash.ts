import { neon } from "@neondatabase/serverless";

/**
 * Migration script to add passwordHash column to users table
 * This migration is idempotent and can be run multiple times safely
 */
async function migratePasswordHash() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const sql = neon(databaseUrl);

  try {
    console.log("Starting migration: Adding passwordHash column to users table...");

    // Check if the column already exists
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'password_hash'
    `;

    if (columnCheck.length > 0) {
      console.log("✓ passwordHash column already exists, skipping migration");
      return;
    }

    // Add the passwordHash column
    await sql`
      ALTER TABLE users 
      ADD COLUMN password_hash VARCHAR(255)
    `;

    console.log("✓ Successfully added passwordHash column to users table");
    console.log("✓ Migration completed successfully");

  } catch (error) {
    console.error("✗ Migration failed:", error);
    throw error;
  }
}

// Run the migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migratePasswordHash()
    .then(() => {
      console.log("Migration script finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}

export { migratePasswordHash };
