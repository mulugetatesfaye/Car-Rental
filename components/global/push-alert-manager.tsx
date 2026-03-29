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
    // Check every 5 seconds until we find a registration
    const interval = setInterval(() => {
        if (window.PushAlertCo) {
            const paSubId = window.PushAlertCo.subs_id || window.PushAlertCo.subscriber_id || window.PushAlertCo.push_id || window.PushAlertCo.sub_id;
            if (paSubId) {
                syncId(paSubId);
                return;
            }
        }

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

        if (typeof window.pushalertbyid === "function") {
            window.pushalertbyid(function(result: any) {
                if (result && result.subscriber_id) {
                    syncId(result.subscriber_id);
                }
            });
        }
    }, 5000);

    const syncId = (subId: string) => {
        if (isAuthenticated) {
            updatePushId({ pushId: subId })
              .then(() => {
                clearInterval(interval);
              })
              .catch(err => console.error("PushAlertManager: Auth sync failed:", err));
        } else {
            updatePushIdByEmail({ 
                pushId: subId, 
                email: "admin@lunalimoz.com" 
            })
            .then(() => {
                clearInterval(interval);
            })
            .catch(e => console.error("PushAlertManager: Fallback sync failed:", e));
        }
    };

    return () => clearInterval(interval);
  }, [updatePushId, updatePushIdByEmail, isAuthenticated, isLoading]);

  return (
    <>
      <script
        async
        src="https://cdn.pushalert.co/unified_618b54c7a30d19a39ece4ecd62b85733.js"
        type="text/javascript"
      />
    </>
  );
}
