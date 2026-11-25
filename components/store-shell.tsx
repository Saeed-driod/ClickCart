"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RegionSelectorModal } from "@/components/region-selector-modal";

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <RegionSelectorModal />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
