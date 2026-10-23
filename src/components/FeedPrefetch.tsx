"use client";

import { useEffect } from "react";

/**
 * Warms the Vantage threat feed (server cache + browser HTTP cache) with the
 * exact default query the Vantage page issues, so it opens instantly.
 */
export default function FeedPrefetch() {
  useEffect(() => {
    const warm = () => {
      fetch("/api/threat-feed?sortBy=published_desc&page=1&limit=50").catch(() => {});
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(warm);
    } else {
      setTimeout(warm, 1500);
    }
  }, []);

  return null;
}
