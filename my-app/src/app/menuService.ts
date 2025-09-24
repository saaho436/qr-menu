// src/lib/menuService.ts
import { db } from "@/app/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface Item {
  name: string;
  price: number;
}

const menuDocRef = doc(db, "menu", "categories"); 
// Collection: menu → Document: categories

// ✅ Get all categories
export async function getCategories(): Promise<Record<string, Item[]>> {
  const snap = await getDoc(menuDocRef);
  if (snap.exists()) {
    return snap.data() as Record<string, Item[]>;
  }
  return {};
}

// ✅ Add new category
export async function addCategory(categoryName: string) {
  const categories = await getCategories();
  if (!categories[categoryName]) {
    categories[categoryName] = [];
    await setDoc(menuDocRef, categories, { merge: true });
  }
}

// ✅ Add item to category
export async function addItem(categoryName: string, item: Item) {
  const categories = await getCategories();
  if (!categories[categoryName]) categories[categoryName] = [];
  categories[categoryName].push(item);
  await setDoc(menuDocRef, categories, { merge: true });
}

// ✅ Update item
export async function updateItem(categoryName: string, index: number, updatedItem: Item) {
  const categories = await getCategories();
  if (categories[categoryName] && categories[categoryName][index]) {
    categories[categoryName][index] = updatedItem;
    await setDoc(menuDocRef, categories, { merge: true });
  }
}

// ✅ Delete item
export async function deleteItem(categoryName: string, index: number) {
  const categories = await getCategories();
  if (categories[categoryName]) {
    categories[categoryName].splice(index, 1);
    await setDoc(menuDocRef, categories, { merge: true });
  }
}

// ✅ Delete category
export async function deleteCategory(categoryName: string) {
  const categories = await getCategories();
  if (categories[categoryName]) {
    delete categories[categoryName]; // remove the category completely
    await setDoc(menuDocRef, categories); // overwrite with updated object
  }
}

