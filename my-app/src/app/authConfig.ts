// src/authConfig.ts
import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig"; // ✅ make sure firebaseConfig exports app

// Firebase Auth
export const auth = getAuth(app);

// List of allowed admin emails
export const ADMIN_EMAILS = [
  "venkyg2510@gmail.com", // 👈 replace with real admin email
  "anotheradmin@example.com",
];
