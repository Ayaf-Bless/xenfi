"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}
