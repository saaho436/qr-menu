// src/authService.ts
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./authConfig";

// 🔐 Login with email/password
export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// 🚪 Logout
export async function logout() {
  return signOut(auth);
}

// 👂 Listen to authentication state
export function listenAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
