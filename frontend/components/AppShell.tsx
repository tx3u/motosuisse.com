"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Next.js App Router can leave pointer-events:none on <html> after navigation.
  // Run on the next frame so it fires after all transition effects settle.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      document.documentElement.style.removeProperty("pointer-events");
      document.body.style.removeProperty("pointer-events");
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
