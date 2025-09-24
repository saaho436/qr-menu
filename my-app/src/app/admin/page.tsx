"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCategories,
  addCategory,
  addItem,
  updateItem,
  deleteItem,
  deleteCategory, // 👈 new
  Item,
} from "../menuService";
import { listenAuth, logout } from "../authService"; 
import { ADMIN_EMAILS } from "../authConfig"; 

export default function AdminPage() {
  const [categories, setCategories] = useState<Record<string, Item[]>>({});
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState({ name: "", price: "" });
  const router = useRouter();

  // 🔐 Listen to auth state
  useEffect(() => {
    const unsubscribe = listenAuth((u) => {
      if (!u || !ADMIN_EMAILS.includes(u.email || "")) {
        router.push("/login"); 
      } else {
        setUser(u);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  async function refreshData() {
    const data = await getCategories();
    setCategories(data);
    if (selectedCategory && !data[selectedCategory]) {
      setSelectedCategory(""); // reset if category was deleted
    }
  }

  async function handleAddCategory() {
    if (!newCategory) return;
    await addCategory(newCategory);
    await refreshData();
    setNewCategory("");
  }

  async function handleDeleteCategory() {
    if (!selectedCategory) return;
    if (!confirm(`Are you sure you want to delete category "${selectedCategory}"?`)) return;
    await deleteCategory(selectedCategory);
    await refreshData();
  }

  async function handleAddItem() {
    if (!selectedCategory || !newItem.name || !newItem.price) return;
    await addItem(selectedCategory, {
      name: newItem.name,
      price: parseFloat(newItem.price),
    });
    await refreshData();
    setNewItem({ name: "", price: "" });
  }

  async function handleDeleteItem(index: number) {
    await deleteItem(selectedCategory, index);
    await refreshData();
  }

  async function handleUpdateItem(index: number) {
    if (!editItem.name || !editItem.price) return;
    await updateItem(selectedCategory, index, {
      name: editItem.name,
      price: parseFloat(editItem.price),
    });
    await refreshData();
    setEditingIndex(null);
    setEditItem({ name: "", price: "" });
  }

  if (authLoading) return <p className="p-4">Checking auth...</p>;
  if (!user) return null;

  return (
    <div className="p-8 space-y-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-red-700">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Add Category */}
      <div className="p-4 bg-white rounded-xl shadow space-y-3">
        <h2 className="font-semibold text-lg">Add Category</h2>
        <div className="flex gap-2">
          <input
            className="border rounded p-2 flex-1"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            onClick={handleAddCategory}
            className="bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {/* Select + Delete Category */}
      <div className="p-4 bg-white rounded-xl shadow space-y-3">
        <h2 className="font-semibold text-lg">Select Category</h2>
        <div className="flex gap-2">
          <select
            className="border rounded p-2 flex-1"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Choose a category --</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <button
              onClick={handleDeleteCategory}
              className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Delete Category
            </button>
          )}
        </div>
      </div>

      {/* Add Item */}
      {selectedCategory && (
        <div className="p-4 bg-white rounded-xl shadow space-y-3">
          <h2 className="font-semibold text-lg">Manage {selectedCategory}</h2>

          {/* Add Item Form */}
          <div className="flex gap-2">
            <input
              className="border rounded p-2 flex-1"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              className="border rounded p-2 w-32"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />
            <button
              onClick={handleAddItem}
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Items List */}
          <ul className="mt-4 space-y-2">
            {categories[selectedCategory]?.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                {editingIndex === idx ? (
                  <>
                    <input
                      className="border rounded p-1 flex-1 mr-2"
                      value={editItem.name}
                      onChange={(e) =>
                        setEditItem({ ...editItem, name: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="border rounded p-1 w-20 mr-2"
                      value={editItem.price}
                      onChange={(e) =>
                        setEditItem({ ...editItem, price: e.target.value })
                      }
                    />
                    <button
                      onClick={() => handleUpdateItem(idx)}
                      className="bg-blue-600 text-white px-3 py-1 rounded mr-2 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="text-gray-500 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span>
                      {item.name} - ₹{item.price}
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingIndex(idx);
                          setEditItem({
                            name: item.name,
                            price: item.price.toString(),
                          });
                        }}
                        className="text-blue-600 font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(idx)}
                        className="text-red-600 font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
