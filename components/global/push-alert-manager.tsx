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
    _pa?: any;
  }
}

export function PushAlertManager() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const updatePushId = useMutation(api.users.updatePushId);
  const updatePushIdByEmail = useMutation(api.users.updatePushIdByEmail);

  React.useEffect(() => {
    console.log("PushAlertManager: Monitoring for subscriber registration...");
    
    const interval = setInterval(() => {
        // Debug logs to see what's available
        console.log("PushAlert Detection Check:", {
            PushAlertCo: !!window.PushAlertCo,
            _pa: !!window._pa,
            PushAlert: !!window.PushAlert,
            permission: typeof Notification !== "undefined" ? Notification.permission : "N/A"
        });

        if (window.PushAlertCo) {
            const paSubId = window.PushAlertCo.subs_id || window.PushAlertCo.subscriber_id || window.PushAlertCo.push_id || window.PushAlertCo.sub_id;
            console.log("PushAlertManager: window.PushAlertCo stats - ID:", paSubId || "MISSING", "Keys:", Object.keys(window.PushAlertCo));
            
            // If it's missing and permission is already granted, the Service Worker is likely stuck/mismatched
            if (!paSubId && typeof Notification !== "undefined" && Notification.permission === "granted") {
                console.warn("PushAlertManager: Permission is 'granted' but NO ID found. SERVICE WORKER LIKELY MISMATCHED.");
                console.info("FIX: Go to DevTools -> Application -> Service Workers -> Unregister 'sw.js' AND Refresh the page.");
            }

            // If it's missing and permission is default, try to trigger the prompt
            if (!paSubId && typeof Notification !== "undefined" && Notification.permission === "default") {
                console.log("PushAlertManager: Permission is default, attempting to show prompt...");
                if (typeof window.PushAlertCo.show_prompt === "function") window.PushAlertCo.show_prompt();
            }

            if (paSubId) {
                syncId(paSubId);
                return;
            }
        }

        // Method 2: Global _pa object
        if (window._pa && window._pa.subscriber_id) {
            syncId(window._pa.subscriber_id);
            return;
        }

        // @ts-ignore
        if (window.PushAlert && window.PushAlert.subscriber_id) {
            // @ts-ignore
            syncId(window.PushAlert.subscriber_id);
            return;
        }

        // Method 3: JavaScript API call
        if (typeof window.pushalertbyid === "function") {
            window.pushalertbyid(function(result: any) {
                if (result && result.subscriber_id) {
                    syncId(result.subscriber_id);
                }
            });
        }
    }, 2000);

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
                email: "admin@lunalimoz.com" 
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
      {/* We use a standard script tag here because of PushAlert's reliance on specific load timing */}
      <script
        async
        src="https://cdn.pushalert.co/unified_618b54c7a30d19a39ece4ecd62b85733.js"
        type="text/javascript"
      />
    </>
  );
}
