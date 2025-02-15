"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import qs from "query-string";
import { Input } from "@/components/ui/input";
import Box from "../(routes)/search/_components/box";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const HomesearchContainer = () => {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleClick = () => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: {
        title: title || undefined,
      },
    });
    router.push(href);
  };

  return (
    <div className="w-full flex items-center justify-center mt-12 px-6 md:px-12">
      <Box className="w-full md:w-3/4 p-6 rounded-lg shadow-xl flex items-center space-x-4 bg-white">
        <Input
          placeholder="Search by job name..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-xl font-medium bg-transparent outline-none border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-purple-500"
        />
        <Button
          onClick={handleClick}
          disabled={!title}
          className={`bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-3 disabled:bg-gray-400`}
          size="icon"
        >
          <Search className="w-5 h-5"/>
        </Button>
      </Box>
    </div>
  );
};
