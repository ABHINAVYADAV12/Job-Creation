"use client"

import { Category } from "@prisma/client"
import CategoryItem from "./category-item"

 interface CategoriesProps{
   categories:Category[]
 }
 
 export const Categories = ({categories}:CategoriesProps) => {
   return (
     <div className="flex items-center gap-x-2 overflow-auto pb-2 scrollbar-none">
     { categories.map(category =>(
        <CategoryItem key={category.id}
        label={category.name}
        value={category.id}
        />
      ))}
      </div>
   )
 }
 