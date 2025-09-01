const admin = require("firebase-admin");

// Initialize with explicit project ID for emulator
admin.initializeApp({
  projectId: "demo-spin-the-wheel",
});

const db = admin.firestore();

// Connect to emulator
db.settings({
  host: "localhost:8080",
  ssl: false,
});

const wheelConfig = {
  cooldownSec: 30,
  segments: [
    { label: "10 Points", weight: 10, color: "#fca5a5" },
    { label: "Try Again", weight: 25, color: "#fdba74" },
    { label: "50 Points", weight: 5, color: "#fde047" },
    { label: "Free Item", weight: 2, color: "#86efac" },
    { label: "20 Points", weight: 8, color: "#93c5fd" },
    { label: "Coupon", weight: 5, color: "#c4b5fd" },
    { label: "5 Points", weight: 20, color: "#f9a8d4" },
    { label: "Mystery", weight: 5, color: "#a7f3d0" },
  ],
};

async function seed() {
  try {
    console.log("Seeding wheelConfig/default...");
    await db.doc("wheelConfig/default").set(wheelConfig);
    console.log("✅ Successfully seeded wheelConfig/default");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

seed();
