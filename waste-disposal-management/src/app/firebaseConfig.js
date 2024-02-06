// Import the Firebase SDK
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { API_KEY, PROJECT_ID, AUTH_DOMAIN, DATABASE_URL, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from './api';

// Initialize Firebase with your project's configuration
const firebaseConfig = {
    apiKey: API_KEY,
    projectId: PROJECT_ID,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
};

const app = initializeApp(firebaseConfig);

// Create a Firestore database reference
export const db = getFirestore(app);

// Create an authentication reference
export const auth = getAuth(app);