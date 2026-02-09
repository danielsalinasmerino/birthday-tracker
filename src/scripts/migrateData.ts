import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import mockData from "../data/mockData.json";

async function migrateData() {
  console.log("🚀 Starting data migration to Firestore...\n");

  try {
    // Migrate Users
    console.log("📝 Migrating users...");
    for (const user of mockData.users) {
      const userData = {
        ...user,
        birthDate: new Date(user.birthDate),
      };

      await setDoc(doc(db, "users", user.id), userData);
      console.log(`✅ Migrated user: ${user.name} ${user.surname}`);
    }
    console.log(`\n✨ Successfully migrated ${mockData.users.length} users\n`);

    // Migrate Groups
    console.log("👥 Migrating groups...");
    for (const group of mockData.groups) {
      await setDoc(doc(db, "groups", group.id), group);
      console.log(`✅ Migrated group: ${group.name}`);
    }
    console.log(
      `\n✨ Successfully migrated ${mockData.groups.length} groups\n`,
    );

    console.log("🎉 Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: ${mockData.users.length}`);
    console.log(`   - Groups: ${mockData.groups.length}`);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    throw error;
  }
}

// Run migration
migrateData()
  .then(() => {
    console.log("\n✅ You can now close this script");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
