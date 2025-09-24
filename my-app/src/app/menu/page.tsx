"use client";

import { useEffect, useState } from "react";
import { getMenuData } from "../fetchData";
import { ArrowUp } from "lucide-react";

export default function MenuPage() {
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading)
    return (
      <p className="text-center text-white text-lg font-semibold">
        Loading menu...
      </p>
    );
  if (!menu)
    return (
      <p className="text-center text-white text-lg font-semibold">
        No menu found
      </p>
    );

  // Filtered Menu Logic
  const filteredMenu: Record<string, any[]> = {};
  Object.keys(menu).forEach((category) => {
    const categoryMatch = category
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const items = menu[category].filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categoryAllowed =
      selectedCategory === "All" || selectedCategory === category;

    if (categoryAllowed && (categoryMatch || items.length > 0)) {
      filteredMenu[category] = categoryMatch ? menu[category] : items;
    }
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-50 shadow-md">
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-center text-amber-900 py-4 sm:py-5 drop-shadow-lg tracking-wide">
          Moonlight Siri Restaurant
        </h1>

        <div className="px-6 sm:px-8 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 max-w-5xl mx-auto w-full">
            <input
              type="text"
              placeholder="Search dishes or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 rounded-xl border border-gray-300 px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 shadow"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-1/3 rounded-xl border border-gray-300 px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 shadow bg-white"
            >
              <option value="All">All Categories</option>
              {Object.keys(menu).map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={handleClearFilters}
              className="px-5 py-3 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition w-full md:w-auto"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-6 sm:px-8 py-8">
        {Object.keys(filteredMenu).length === 0 ? (
          <p className="text-center text-amber-800 text-xl font-semibold">
            No items found
          </p>
        ) : (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {Object.keys(filteredMenu).map((category) => (
              <div
                key={category}
                className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-amber-200/50"
              >
                {/* Sticky Category Title */}
                <div className="sticky top-[70px] sm:top-[80px] bg-white z-40">
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-800 border-b-2 border-amber-300 py-2 text-center">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h2>
                </div>

                {/* Items */}
                <ul className="space-y-2 sm:space-y-3 mt-4">
                  {filteredMenu[category].map((item: any, index: number) => (
                    <li
                      key={index}
                      className="flex items-center text-base sm:text-lg"
                    >
                      <span className="font-medium text-gray-800">
                        {item.name}
                      </span>
                      <span className="flex-grow text-gray-400 mx-2 flex items-center">
                        <span className="flex-grow border-b border-gray-300"></span>
                        <span className="mx-1">--&gt;</span>
                      </span>
                      <span className="font-semibold text-amber-700">
                        ₹{item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg transition z-50"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
