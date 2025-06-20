"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";

// Use dynamic import for the site customization client
const SiteCustomizationClient = dynamic(
  () => import("./page.client").then((mod) => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="p-8">
        <LoadingScreen />
      </div>
    ),
  }
);

export default function SiteCustomizationClientWrapper({ params }: { params: { username: string } }) {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <LoadingScreen />
        </div>
      }
    >
      <SiteCustomizationClient params={params} />
    </Suspense>
  );
}
