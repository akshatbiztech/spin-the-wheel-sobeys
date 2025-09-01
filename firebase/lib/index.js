"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.spinWheel = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
function chooseWeightedIndex(segments, rnd) {
  const total = segments.reduce((sum, s) => sum + (s.weight || 0), 0);
  let acc = 0;
  for (let i = 0; i < segments.length; i++) {
    acc += segments[i].weight || 0;
    if (rnd * total < acc) return i;
  }
  return segments.length - 1; // fallback
}
exports.spinWheel = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Sign-in required."
    );
  }
  const uid = context.auth.uid;
  const clientRequestId = data?.clientRequestId ?? null;
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
  const config = configSnap.data();
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
      nextAllowedAt: doc.nextAllowedAt.toDate().toISOString(),
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
    const lastAt = last.createdAt.toMillis();
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
    createdAt: new Date(now),
    nextAllowedAt: new Date(nextAllowedAt),
  });
  return {
    spinId: spinRef.id,
    winningIndex,
    prizeLabel,
    nextAllowedAt: nextAllowedAt.toISOString(),
  };
});
exports.getHistory = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Sign-in required."
    );
  }
  const uid = context.auth.uid;
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
      createdAt: s.createdAt.toDate().toISOString(),
    };
  });
  return items;
});
