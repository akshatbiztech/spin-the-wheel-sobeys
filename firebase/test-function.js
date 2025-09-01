const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp({
  projectId: "demo-spin-the-wheel",
});

const db = admin.firestore();

// Connect to emulator
db.settings({
  host: "localhost:8080",
  ssl: false,
});

async function testFunction() {
  try {
    console.log("Testing Firestore connection...");

    // Test reading the wheel config
    const configSnap = await db.doc("wheelConfig/default").get();
    if (configSnap.exists) {
      console.log("✅ Wheel config exists:", configSnap.data());
    } else {
      console.log("❌ Wheel config does not exist");
    }

    // Test writing a test document
    const testRef = await db.collection("test").add({
      test: true,
      timestamp: admin.firestore.Timestamp.now(),
    });
    console.log("✅ Test write successful:", testRef.id);

    // Clean up test document
    await testRef.delete();
    console.log("✅ Test cleanup successful");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testFunction();
