"use client";

import { useSyncExternalStore } from "react";
import {
  getApiLoadingSnapshot,
  subscribeApiLoading,
} from "@/lib/apiLoadingStore";

export function GlobalApiLoader() {
  const activeRequests = useSyncExternalStore(
    subscribeApiLoading,
    getApiLoadingSnapshot,
    getApiLoadingSnapshot,
  );

  if (activeRequests <= 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-1 overflow-hidden bg-transparent">
      <div className="global-api-loader h-full w-1/3 rounded-r-full" />
    </div>
  );
}
