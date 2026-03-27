"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

const ConvexContext = createContext<ConvexReactClient | null>(null);

export function ConvexProvider({ children }: { children: ReactNode }) {
  const [client] = useState(convex);
  
  return (
    <ConvexAuthProvider client={client}>
      {children}
    </ConvexAuthProvider>
  );
}

export function useConvexClient() {
  return useContext(ConvexContext);
}