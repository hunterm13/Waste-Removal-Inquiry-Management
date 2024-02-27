import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

// Initialize Firebase with your project's configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
};

let app;

// Check if a Firebase app has already been initialized
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // if already initialized, use that one
}

// Create a Firestore database reference
export const db = getFirestore(app);

// Create an authentication reference
const auth = getAuth(app);
export { auth };
