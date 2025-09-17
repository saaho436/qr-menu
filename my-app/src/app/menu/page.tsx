"use client";

import { useEffect, useState } from "react";
import { getMenuData } from "../fetchData";

export default function MenuPage() {
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await getMenuData();
        setMenu(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  if (loading) return <p className="text-center text-white text-lg">Loading menu...</p>;
  if (!menu) return <p className="text-center text-white text-lg">No menu found</p>;

  return (
    <div className="min-h-screen  p-6">
      <h1 className="text-4xl font-extrabold text-center text-black mb-10 drop-shadow-lg">
        Reddy&apos;s Biryani Darbar
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Object.keys(menu).map((category) => (
          <div
            key={category}
            className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>

            <ul className="space-y-3">
              {menu[category].map((item: any, index: number) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b pb-2 last:border-none"
                >
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="text-gray-600">₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
