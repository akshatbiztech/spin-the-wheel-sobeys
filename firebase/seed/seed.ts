import * as admin from "firebase-admin";

(async () => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: "demo-spin-the-wheel",
    });
  }

  const db = admin.firestore();

  // Connect to emulator
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });

  await db.doc("wheelConfig/default").set(
    {
      cooldownSec: 30,
      segments: [
        { label: "Try Again", weight: 25, color: "#fdba74" }, // index 0 - top
        { label: "50 Points", weight: 5, color: "#fde047" }, // index 1 - top-right
        { label: "Free Item", weight: 2, color: "#86efac" }, // index 2 - right
        { label: "20 Points", weight: 8, color: "#93c5fd" }, // index 3 - bottom-right
        { label: "Coupon", weight: 5, color: "#c4b5fd" }, // index 4 - bottom
        { label: "5 Points", weight: 20, color: "#f9a8d4" }, // index 5 - bottom-left
        { label: "Mystery", weight: 5, color: "#a7f3d0" }, // index 6 - left
        { label: "10 Points", weight: 10, color: "#fca5a5" }, // index 7 - top-left
      ],
    },
    { merge: true as any }
  );
  console.log("Seeded wheelConfig/default");
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
