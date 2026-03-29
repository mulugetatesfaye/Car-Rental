"use client";

import * as React from "react";
import Script from "next/script";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

declare global {
  interface Window {
    PushAlertCo?: any;
    pushalertbyid?: any;
  }
}

export function PushAlertManager() {
  const updatePushId = useMutation(api.users.updatePushId);

  React.useEffect(() => {
    console.log("PushAlertManager: Monitoring for subscriber ID...");
    const interval = setInterval(() => {
      if (typeof window.pushalertbyid === "function") {
          console.log("PushAlertManager: SDK ready, checking id...");
          window.pushalertbyid(function(result: any) {
              if (result && result.subscriber_id) {
                  console.log("PushAlertManager: Found subscriber ID:", result.subscriber_id);
                  updatePushId({ pushId: result.subscriber_id })
                    .then(() => {
                      console.log("PushAlertManager: Successfully updated Convex with Push ID");
                      clearInterval(interval);
                    })
                    .catch(err => console.error("PushAlertManager: Mutation failed:", err));
              } else {
                console.log("PushAlertManager: No subscriber ID yet, result:", result);
              }
          });
      } else {
        console.log("PushAlertManager: SDK not yet injected on window");
      }
    }, 5000); // Increased to 5s to avoid log flood

    return () => clearInterval(interval);
  }, [updatePushId]);

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
