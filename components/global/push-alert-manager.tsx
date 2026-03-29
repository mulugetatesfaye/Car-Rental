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
    // This interval checks if PushAlert SDK is ready to give us the subscriber ID
    const interval = setInterval(() => {
      if (typeof window.pushalertbyid === "function") {
          window.pushalertbyid(function(result: any) {
              if (result.subscriber_id) {
                  updatePushId({ pushId: result.subscriber_id })
                    .catch(err => console.error("Failed to sync Push ID:", err));
                  clearInterval(interval);
              }
          });
      }
    }, 2000);

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
