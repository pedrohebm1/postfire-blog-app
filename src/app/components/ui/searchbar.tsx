"use client";
import { getStorage, saveStorage } from "@/app/lib/localStorage";
import { useState, useEffect } from "react";
import React from "react";

export default function Searchbar() {
  const [content, setContent] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const storedSearches = getStorage("recentSearches");
    if (storedSearches) {
      setRecentSearches(storedSearches);
    }
  }, []);

  const handleSearch = (searchTerm: string, category: "users" | "posts") => {
    let updatedSearches = [searchTerm, ...recentSearches.filter((term) => term !== searchTerm)];
    if (updatedSearches.length > 4) {
      updatedSearches = updatedSearches.slice(0, 4);
    }
    setRecentSearches(updatedSearches);
    saveStorage("recentSearches", updatedSearches);
    window.location.href = `/search?query=${encodeURIComponent(searchTerm)}&category=${category}`;
  };

  return (
    <div className="w-3/6 h-10 m-auto self-center md:w-2/6">
      <div
        className={`relative w-full self-center bg-white rounded-md overflow-hidden outline outline-1 outline-slate-200 flex flex-col transition-all h-10}`}
      >
        <div className="flex flex-row items-center mt-1 mb-1 w-full self-start">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full outline-none px-4 py-1 leading-6"
            type="text"
            placeholder="Search..."
          />
          {content && (
            <button
              onClick={() => setContent("")}
              className="h-6 pr-4 px-4 py-0 ml-auto cursor-pointer leading-3"
            >
              X
            </button>
          )}
          <img
            className="h-4 pr-2 ml-auto cursor-pointer mr-1"
            src="/static/images/magnifyingglass.png"
            alt="Magnifying glass"
            onClick={() => handleSearch(content, "users")}
          />
        </div>
        {content.length > 0 && (
          <>
            <div
              className="border-t-1 mt-1 h-10 flex align-middle hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSearch(content, "posts")}
            >
              <span className="mx-4 h-10 leading-10 truncate">
                <span>Search in posts for </span>
                <span className="text-blue-500">{content}</span>
              </span>
            </div>
            <div
              className="h-10 flex align-middle hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSearch(content, "users")}
            >
              <span className="mx-4 leading-10 truncate">
                <span>Search in users for </span>
                <span className="text-blue-500">{content}</span>
              </span>
            </div>
          </>
        )}
        {recentSearches.length > 0 && content.length > 0 && (
          <div className=" mt-1">
            <h3 className="px-4 py-2 text-sm font-semibold">Recent Searches</h3>
            {recentSearches.map((term, index) => (
              <div
                key={index}
                className="h-10 flex align-middle hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSearch(term, "users")}
              >
                <span className="mx-4 leading-10">{term}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}