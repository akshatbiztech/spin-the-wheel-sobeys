import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

type Segment = {
  label: string;
  weight: number;
  color?: string;
};

type WheelConfig = {
  segments: Segment[]; // must be length 8
  cooldownSec: number; // e.g., 30
};

function chooseWeightedIndex(segments: Segment[], rnd: number): number {
  const total = segments.reduce((sum, s) => sum + (s.weight || 0), 0);
  let acc = 0;
  for (let i = 0; i < segments.length; i++) {
    acc += segments[i].weight || 0;
    if (rnd * total < acc) return i;
  }
  return segments.length - 1; // fallback
}

export const spinWheel = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Sign-in required."
    );
  }
  const uid = context.auth.uid as string;
  const clientRequestId = (data?.clientRequestId as string | undefined) ?? null;
  if (!clientRequestId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "clientRequestId is required."
    );
  }

  const configSnap = await db.doc("wheelConfig/default").get();
  if (!configSnap.exists) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Wheel config missing."
    );
  }
  const config = configSnap.data() as WheelConfig;
  if (!config.segments || config.segments.length !== 8) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Wheel must have 8 segments."
    );
  }

  // Idempotency: return existing result if we've already processed this requestId
  const existing = await db
    .collection("spins")
    .where("uid", "==", uid)
    .where("clientRequestId", "==", clientRequestId)
    .limit(1)
    .get();
  if (!existing.empty) {
    const doc = existing.docs[0].data();
    return {
      spinId: existing.docs[0].id,
      winningIndex: doc.winningIndex,
      prizeLabel: doc.prizeLabel,
      nextAllowedAt: (doc.nextAllowedAt as admin.firestore.Timestamp)
        .toDate()
        .toISOString(),
    };
  }

  // Cooldown: check most recent spin
  const lastSnap = await db
    .collection("spins")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();
  const now = new Date();
  let nextAllowedAt = new Date(now.getTime());
  if (!lastSnap.empty) {
    const last = lastSnap.docs[0].data();
    const lastAt = (last.createdAt as admin.firestore.Timestamp).toMillis();
    const next = lastAt + config.cooldownSec * 1000;
    if (now.getTime() < next) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Cooldown active.",
        {
          nextAllowedAt: new Date(next).toISOString(),
        }
      );
    }
    nextAllowedAt = new Date(next);
  } else {
    // if first ever spin, nextAllowedAt is now + cooldown for UX
    nextAllowedAt = new Date(now.getTime() + config.cooldownSec * 1000);
  }

  const rnd = Math.random();
  const winningIndex = chooseWeightedIndex(config.segments, rnd);
  const prizeLabel = config.segments[winningIndex].label;

  // Persist spin
  const spinRef = await db.collection("spins").add({
    uid,
    clientRequestId,
    winningIndex,
    prizeLabel,
    createdAt: admin.firestore.Timestamp.fromDate(now),
    nextAllowedAt: admin.firestore.Timestamp.fromDate(nextAllowedAt),
  });

  return {
    spinId: spinRef.id,
    winningIndex,
    prizeLabel,
    nextAllowedAt: nextAllowedAt.toISOString(),
  };
});

export const getHistory = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Sign-in required."
    );
  }
  const uid = context.auth.uid as string;
  const snap = await db
    .collection("spins")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();
  const items = snap.docs.map((d) => {
    const s = d.data();
    return {
      spinId: d.id,
      winningIndex: s.winningIndex,
      prizeLabel: s.prizeLabel,
      createdAt: (s.createdAt as admin.firestore.Timestamp)
        .toDate()
        .toISOString(),
    };
  });
  return items;
});
