"use client";

import { useEffect } from "react";

interface JsonLdProps {
  id?: string;
  data: Record<string, unknown>;
}

export default function JsonLd({ id = "json-ld", data }: JsonLdProps) {
  useEffect(() => {
    const existing = document.getElementById(id);
    if (existing) {
      existing.textContent = JSON.stringify(data);
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(id);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [id, data]);

  return null;
}
