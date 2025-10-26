"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Plasma from "@/components/plasma";

// Renders Plasma everywhere except under /admin
export default function PlasmaRouteGuard(props: {
  color?: string;
  speed?: number;
  direction?: "forward" | "reverse" | "pingpong";
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;
  return <Plasma {...props} />;
}