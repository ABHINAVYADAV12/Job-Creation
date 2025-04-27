"use client"

import { Category } from "@prisma/client"
import CategoryItem from "./category-item"
import { useState } from "react";

interface CategoriesProps{
  categories:Category[]
}

export const Categories = ({categories}:CategoriesProps) => {
  const [search, setSearch] = useState("");
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="w-full">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search categories..."
        className="mb-2 w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      <div className="flex items-center gap-x-2 overflow-auto pb-2 scrollbar-none">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <CategoryItem key={category.id}
              label={category.name}
              value={category.id}
            />
          ))
        ) : (
          <span className="text-gray-400 text-sm px-2">No categories found.</span>
        )}
      </div>
    </div>
  )
}