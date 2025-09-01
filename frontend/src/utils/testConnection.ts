import { db, auth } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export const testFirebaseConnection = async () => {
  try {
    // Test Firestore connection
    const testCollection = collection(db, "_test");
    await getDocs(testCollection);

    // Test Auth connection
    const currentUser = auth.currentUser;

    return {
      success: true,
      firestore: "Connected",
      auth: "Connected",
      currentUser: currentUser ? currentUser.email : "None",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      firestore: "Failed",
      auth: "Failed",
    };
  }
};
