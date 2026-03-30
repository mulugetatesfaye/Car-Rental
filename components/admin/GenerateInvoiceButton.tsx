"use client";

import React, { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { FileText, Mail, Download, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink, pdf, Document, Page, Text, View } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF";

interface Props {
  ride: Doc<"rides">;
}

export function GenerateInvoiceButton({ ride }: Props) {
  const settings = useQuery(api.settings.get);
  const sendInvoiceAction = useAction(api.actions.sendInvoice);
  
  const [isEmailing, setIsEmailing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">("idle");
  const [showOptions, setShowOptions] = useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Convert Blob to Base64 for the Convex Action
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip the data:application/pdf;base64, prefix
        const base64Content = base64String.split(",")[1];
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleEmailInvoice = async () => {
    if (isEmailing) return;
    
    setIsEmailing(true);
    setEmailStatus("idle");
    
    try {
      // 1. Generate the PDF instance
      const doc = <InvoicePDF ride={ride} settings={settings as any} />;
      const blob = await pdf(doc).toBlob();
      
      // 2. Convert to base64
      const base64 = await blobToBase64(blob);
      
      // 3. Send via Convex Action
      const result = await sendInvoiceAction({
        rideId: ride._id,
        pdfBase64: base64
      });
      
      if (result.success) {
        setEmailStatus("success");
        setTimeout(() => setEmailStatus("idle"), 3000);
      } else {
        setEmailStatus("error");
      }
    } catch (error) {
      console.error("Invoicing Error:", error);
      alert("Failed to generate or send the invoice email. Please check the browser console.");
      setEmailStatus("error");
    } finally {
      setIsEmailing(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      console.log("Generating Minimal Test PDF...");
      // Try rendering a very minimal doc to see if the library itself works
      const testDoc = (
        <Document>
          <Page size="A4">
            <View style={{ padding: 40 }}>
              <Text>Luna Limo Invoice Test</Text>
              <Text>ID: {ride._id}</Text>
            </View>
          </Page>
        </Document>
      );
      
      const blob = await pdf(testDoc).toBlob();
      console.log("PDF generated successfully, size:", blob.size);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LunaLimo-Test-${ride._id.slice(-6)}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Critical PDF Generation Error:", error);
      alert("PDF library failed even with minimal doc. See console for error.");
    } finally {
      setIsDownloading(false);
    }
  };

  const invoiceNumber = `INV-${ride._id.slice(-6).toUpperCase()}`;

  return (
    <div className="relative inline-block w-full">
      {!showOptions ? (
        <Button
          onClick={() => setShowOptions(true)}
          variant="outline"
          size="sm"
          className="w-full bg-gold/10 text-gold border-gold/30 hover:bg-gold hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest h-8"
        >
          <FileText className="h-3 w-3 mr-2" />
          Invoicing
        </Button>
      ) : (
        <div className="flex flex-col gap-1 animate-in slide-in-from-right-2 duration-300">
          {/* Download Option */}
          <Button
            onClick={handleDownloadInvoice}
            variant="outline"
            size="sm"
            disabled={isDownloading}
            className="w-full bg-black border-neutral-800 text-neutral-400 hover:text-white rounded-none text-[8px] font-black uppercase tracking-widest h-7 justify-start gap-2"
          >
            {isDownloading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
            {isDownloading ? "Generating..." : "Download PDF"}
          </Button>

          {/* Email Option */}
          <Button
            onClick={handleEmailInvoice}
            disabled={isEmailing}
            variant="outline"
            size="sm"
            className={`w-full border-neutral-800 rounded-none text-[8px] font-black uppercase tracking-widest h-7 justify-start gap-2 ${
              emailStatus === "success" ? "bg-emerald-950/30 text-emerald-500 border-emerald-900" :
              emailStatus === "error" ? "bg-red-950/30 text-red-500 border-red-900" :
              "bg-black text-neutral-400 hover:text-white"
            }`}
          >
            {isEmailing ? <Loader2 className="h-3 w-3 animate-spin" /> : 
             emailStatus === "success" ? <Check className="h-3 w-3" /> :
             emailStatus === "error" ? <AlertCircle className="h-3 w-3" /> :
             <Mail className="h-3 w-3" />}
            {isEmailing ? "Sending..." : emailStatus === "success" ? "Sent!" : emailStatus === "error" ? "Failed" : "Email to Client"}
          </Button>

          {/* Close Options */}
          <button 
            onClick={() => setShowOptions(false)}
            className="text-neutral-600 hover:text-neutral-400 text-[7px] font-black uppercase tracking-widest mt-1 underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
