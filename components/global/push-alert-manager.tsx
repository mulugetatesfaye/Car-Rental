"use client";

import * as React from "react";
import Script from "next/script";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth } from "convex/react";

declare global {
  interface Window {
    PushAlertCo?: any;
    pushalertbyid?: any;
  }
}

export function PushAlertManager() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const updatePushId = useMutation(api.users.updatePushId);
  const updatePushIdByEmail = useMutation(api.users.updatePushIdByEmail);

  React.useEffect(() => {
    console.log("PushAlertManager: Monitoring for subscriber registration...");
    
    // Check every 5 seconds for the ID
    const interval = setInterval(() => {
        // Direct object check
        if (window.PushAlertCo && window.PushAlertCo.subscriber_id) {
            const subId = window.PushAlertCo.subscriber_id;
            console.log("PushAlertManager: Found subscriber ID via object:", subId);
            syncId(subId);
            return;
        }

        // JS API check
        if (typeof window.pushalertbyid === "function") {
            window.pushalertbyid(function(result: any) {
                if (result && result.subscriber_id) {
                    console.log("PushAlertManager: Found subscriber ID via API:", result.subscriber_id);
                    syncId(result.subscriber_id);
                } else {
                    console.log("PushAlertManager: SDK ready but no ID yet. Have you clicked 'Allow'?", result);
                }
            });
        } else {
            console.log("PushAlertManager: Waiting for PushAlert SDK to load on window...");
        }
    }, 5000);

    const syncId = (subId: string) => {
        if (isAuthenticated) {
            updatePushId({ pushId: subId })
              .then(() => {
                console.log("PushAlertManager: Synced via Auth");
                clearInterval(interval);
              })
              .catch(err => console.error("PushAlertManager: Auth sync failed:", err));
        } else {
            console.warn("PushAlertManager: Not authenticated, using email fallback...");
            updatePushIdByEmail({ 
                pushId: subId, 
                email: "mulugeta.t.ayalew@gmail.com" 
            })
            .then(() => {
                console.log("PushAlertManager: Synced via Email Fallback");
                clearInterval(interval);
            })
            .catch(e => console.error("PushAlertManager: Fallback sync failed:", e));
        }
    };

    return () => clearInterval(interval);
  }, [updatePushId, updatePushIdByEmail, isAuthenticated, isLoading]);

  return (
    <>
      <Script
        id="pushalert-unified"
        strategy="afterInteractive"
        src="https://cdn.pushalert.co/unified_618b54c7a30d19a39ece4ecd62b85733.js"
      />
    </>
  );
}
