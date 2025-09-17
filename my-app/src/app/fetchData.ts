// fetchData.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // adjust path if needed

// Fetch menu data (document inside "menu" collection)
export async function getMenuData() {
  try {
    const docRef = doc(db, "menu", "categories"); // menu/categories
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data(); // { soups: [...], biryanies: [...] }
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
}
