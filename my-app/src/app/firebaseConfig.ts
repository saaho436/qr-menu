// firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB3Ma6h7-DbKYQ8yKFxrEmdfARNMRbhk3w",
  authDomain: "qr-menu-e3f68.firebaseapp.com",
  projectId: "qr-menu-e3f68",
  storageBucket: "qr-menu-e3f68.firebasestorage.app",
  messagingSenderId: "580833290315",
  appId: "1:580833290315:web:d6919513fd1160882605ce",
  measurementId: "G-W66H4Z2M9S",
};

// ✅ Avoid re-initializing Firebase in Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore DB
export const db = getFirestore(app);

// Analytics (only runs in browser, not server)
export let analytics: any;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}
