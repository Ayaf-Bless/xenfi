import React from "react";
import { cn } from "@/lib/utils";

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-[#617589] dark:text-gray-400 text-sm font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}
