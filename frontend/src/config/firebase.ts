import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Functions
export const functions = getFunctions(app);

// Connect to emulators in development
if (__DEV__ && process.env.EXPO_PUBLIC_USE_EMULATOR === "true") {
  const firestoreHost =
    process.env.EXPO_PUBLIC_FIRESTORE_EMULATOR_HOST || "localhost:8080";
  const authHost =
    process.env.EXPO_PUBLIC_AUTH_EMULATOR_HOST || "localhost:9099";

  // Connect to Firestore emulator
  connectFirestoreEmulator(
    db,
    firestoreHost.split(":")[0],
    parseInt(firestoreHost.split(":")[1])
  );

  // Connect to Auth emulator
  connectAuthEmulator(auth, `http://${authHost}`);

  // Connect to Functions emulator
  const functionsHost =
    process.env.EXPO_PUBLIC_FUNCTIONS_EMULATOR_HOST || "localhost:5001";
  connectFunctionsEmulator(
    functions,
    functionsHost.split(":")[0],
    parseInt(functionsHost.split(":")[1])
  );
}

export default app;
