"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";

// Use dynamic import for the analytics client
const AnalyticsPageClient = dynamic(
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

export default function AnalyticsClientWrapper({ params }: { params: { username: string } }) {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <LoadingScreen />
        </div>
      }
    >
      <AnalyticsPageClient params={params} />
    </Suspense>
  );
}
