"use client";

import * as React from "react";
import Script from "next/script";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth } from "@convex-dev/auth/react";

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
    console.log("PushAlertManager: Monitoring for subscriber ID...", { isAuthenticated, isLoading });
    
    const interval = setInterval(() => {
      if (typeof window.pushalertbyid === "function") {
          console.log("PushAlertManager: SDK ready, checking id...");
          window.pushalertbyid(function(result: any) {
              if (result && result.subscriber_id) {
                  const subId = result.subscriber_id;
                  console.log("PushAlertManager: Found subscriber ID:", subId);
                  
                  // Primary: Auth-based update
                  if (isAuthenticated) {
                    updatePushId({ pushId: subId })
                      .then(() => {
                        console.log("PushAlertManager: Successfully updated Convex via Auth");
                        clearInterval(interval);
                      })
                      .catch(err => console.error("PushAlertManager: Auth mutation failed:", err));
                  } 
                  // Fallback: Try a hardcoded email update if it matches your admin email
                  // This is a temporary bypass for diagnosing auth-state issues
                  else {
                    console.warn("PushAlertManager: Not authenticated, attempting email fallback update...");
                    updatePushIdByEmail({ 
                        pushId: subId, 
                        email: "mulugeta.t.ayalew@gmail.com" // Your verified admin email
                    })
                    .then(() => {
                        console.log("PushAlertManager: Successfully updated Convex via Email Fallback");
                        clearInterval(interval);
                    })
                    .catch(e => console.error("PushAlertManager: Fallback failed:", e));
                  }
              } else {
                console.log("PushAlertManager: No subscriber ID yet, result:", result);
              }
          });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [updatePushId, updatePushIdByEmail, isAuthenticated, isLoading]);

  return (
    <>
      <Script
        id="pushalert-unified"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(d, t) {
                var g = d.createElement(t),
                s = d.getElementsByTagName(t)[0];
                g.src = "https://cdn.pushalert.co/unified_618b54c7a30d19a39ece4ecd62b85733.js";
                s.parentNode.insertBefore(g, s);
            }(document, "script"));
          `,
        }}
      />
    </>
  );
}
