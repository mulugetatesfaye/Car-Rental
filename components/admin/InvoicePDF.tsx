import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Doc } from "@/convex/_generated/dataModel";

// For professional appearance, Roboto is used as it looks cleaner in PDFs
// If custom fonts are needed, they can be registered here:
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 35,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1.5px solid #C6A87C",
    paddingBottom: 15,
    marginBottom: 20,
  },
  logoSection: {
    flexDirection: "column",
    width: "50%",
  },
  brandingTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  brandingSubtitle: {
    fontSize: 6.5,
    color: "#C6A87C",
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 3,
  },
  invoiceMeta: {
    textAlign: "right",
    width: "40%",
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  metaItem: {
    fontSize: 7.5,
    color: "#666",
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  metaLabel: {
    color: "#999",
    textTransform: "uppercase",
    marginRight: 6,
    fontSize: 6,
  },
  metaValue: {
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  addressSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  addressBlock: {
    width: "45%",
  },
  sectionHeading: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#C6A87C",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    borderBottom : "0.5px solid #eee",
    paddingBottom: 4,
  },
  addressName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 3,
  },
  addressText: {
    fontSize: 8.5,
    color: "#666",
    lineHeight: 1.4,
  },
  journeyBox: {
    backgroundColor: "#fcfaf7",
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
    border: "1px solid #f0e6d6",
  },
  journeyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  journeyItem: {
    flex: 1,
  },
  journeyLabel: {
    fontSize: 6.5,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  journeyValue: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#222",
  },
  routeSection: {
    marginTop: 8,
    paddingTop: 10,
    borderTop: "1px dashed #e0d0b0",
  },
  routeItem: {
    marginBottom: 5,
  },
  routeLabel: {
    fontSize: 6.5,
    color: "#C6A87C",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  routeText: {
    fontSize: 8.5,
    color: "#333",
    lineHeight: 1.2,
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    padding: 6,
    borderRadius: 2,
  },
  headerCell: {
    color: "#fff",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottom: "1px solid #eee",
  },
  cellDescription: {
    flex: 3,
    fontSize: 9,
    color: "#222",
  },
  cellQty: {
    flex: 0.5,
    textAlign: "center",
    fontSize: 9,
    color: "#444",
  },
  cellPrice: {
    flex: 1,
    textAlign: "right",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  summaryBlock: {
    width: "35%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 8.5,
    color: "#777",
  },
  summaryValue: {
    fontSize: 9,
    color: "#222",
    fontFamily: "Helvetica-Bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginTop: 8,
    borderTop: "1.5px solid #C6A87C",
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#C6A87C",
  },
  statusStamp: {
    position: "absolute",
    top: 110,
    right: 50,
    border: "2px solid #C6A87C",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    opacity: 0.15,
    transform: "rotate(-15deg)",
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#C6A87C",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  legalSection: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#fafafa",
    borderRadius: 2,
    border: "0.5px solid #eee",
  },
  legalTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#999",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  legalText: {
    fontSize: 6,
    color: "#aaa",
    lineHeight: 1.3,
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 35,
    right: 35,
    textAlign: "center",
    borderTop: "1px solid #f0f0f0",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7,
    color: "#999",
    marginBottom: 2,
  },
  footerBranding: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#C6A87C",
    marginTop: 4,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  signatureContainer: {
    marginTop: 8,
    fontSize: 6,
    color: "#bbb",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
  }
});

interface InvoicePDFProps {
  ride: Doc<"rides">;
  settings?: {
    companyName: string;
    email: string;
    phone: string;
    address: string;
    [key: string]: any;
  };
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ ride, settings }) => {
  const formattedDate = new Date(ride.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const invoiceNumber = `INV-${ride._id.slice(-8).toUpperCase()}`;

  // Using a full URL for the logo if possible, otherwise it might not render in some environments
  const logoUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/luna-logo.png` 
    : "/luna-logo.png";

  return (
    <Document title={`Invoice ${invoiceNumber} - Luna Limo`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            {/* Logo could go here if we were certain of the path/origin */}
            <Text style={styles.brandingTitle}>Luna Limo</Text>
            <Text style={styles.brandingSubtitle}>Premier Executive Travel</Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.title}>INVOICE</Text>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Invoice Number:</Text>
              <Text style={styles.metaValue}>{invoiceNumber}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Issue Date:</Text>
              <Text style={styles.metaValue}>{formattedDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Fulfillment Status:</Text>
              <Text style={[styles.metaValue, { color: ride.status === "completed" ? "#10B981" : "#F59E0B" }]}>
                {ride.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressBlock}>
            <Text style={styles.sectionHeading}>Issued By Information</Text>
            <Text style={styles.addressName}>{settings?.companyName || "Luna Limo"}</Text>
            <Text style={styles.addressText}>
              {settings?.address || "1902 E Yesler way\nSeattle, WA 98122"}
            </Text>
            <View style={{ marginTop: 8 }}>
              <Text style={styles.addressText}>{settings?.email || "concierge@lunalimo.com"}</Text>
              <Text style={styles.addressText}>{settings?.phone || "(206) 327-4411"}</Text>
            </View>
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.sectionHeading}>Bill To Client</Text>
            <Text style={styles.addressName}>{ride.customerName || "Valued Private Guest"}</Text>
            <Text style={styles.addressText}>{ride.customerEmail}</Text>
            {ride.customerPhone && <Text style={styles.addressText}>{ride.customerPhone}</Text>}
          </View>
        </View>

        {/* Paid Stamp */}
        {ride.status === "completed" && (
          <View style={styles.statusStamp}>
            <Text style={styles.statusText}>PAID</Text>
          </View>
        )}

        {/* Journey Breakdown */}
        <View style={styles.journeyBox}>
          <Text style={styles.sectionHeading}>Chauffeur Service Summary</Text>
          <View style={styles.journeyRow}>
            <View style={styles.journeyItem}>
              <Text style={styles.journeyLabel}>Service Date</Text>
              <Text style={styles.journeyValue}>{ride.pickupDate}</Text>
            </View>
            <View style={styles.journeyItem}>
              <Text style={styles.journeyLabel}>Scheduled Pickup</Text>
              <Text style={styles.journeyValue}>{ride.pickupTime || "TBD"}</Text>
            </View>
            <View style={styles.journeyItem}>
              <Text style={styles.journeyLabel}>Selected Fleet</Text>
              <Text style={styles.journeyValue}>{ride.carTypeName}</Text>
            </View>
          </View>
          <View style={styles.journeyRow}>
            <View style={styles.journeyItem}>
              <Text style={styles.journeyLabel}>Total Distance</Text>
              <Text style={styles.journeyValue}>{ride.distance.toFixed(2)} Miles</Text>
            </View>
            <View style={styles.journeyItem}>
              <Text style={styles.journeyLabel}>Passengers / Luggage</Text>
              <Text style={styles.journeyValue}>{ride.passengers} Pax / {ride.luggage} Bags</Text>
            </View>
          </View>

          <View style={styles.routeSection}>
            <View style={styles.routeItem}>
              <Text style={styles.routeLabel}>Pick-up Location</Text>
              <Text style={styles.routeText}>{ride.pickupAddress}</Text>
            </View>
            <View style={styles.routeItem}>
              <Text style={styles.routeLabel}>Drop-off Destination</Text>
              <Text style={styles.routeText}>{ride.destinationAddress}</Text>
            </View>
          </View>
        </View>

        {/* Services Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 3 }]}>Service Description</Text>
            <Text style={[styles.headerCell, { flex: 0.5, textAlign: "center" }]}>Qty</Text>
            <Text style={[styles.headerCell, { flex: 1, textAlign: "right" }]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={{ flex: 3 }}>
              <Text style={styles.cellDescription}>Executive {ride.carTypeName} Reservation</Text>
              <Text style={{ fontSize: 7, color: "#999", marginTop: 4 }}>
                Private transportation services calculated by per-mile executive rates plus base fare.
              </Text>
            </View>
            <Text style={styles.cellQty}>1</Text>
            <Text style={styles.cellPrice}>${ride.price.toFixed(2)}</Text>
          </View>
          
          {ride.notes && (
            <View style={styles.tableRow}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.cellDescription, { fontFamily: "Helvetica-Bold" }]}>Special Client Instructions:</Text>
                <Text style={{ fontSize: 8, color: "#666", marginTop: 2 }}>{ride.notes}</Text>
              </View>
              <Text style={styles.cellQty}>-</Text>
              <Text style={styles.cellPrice}>$0.00</Text>
            </View>
          )}
        </View>

        {/* Financial Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBlock}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${ride.price.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Executive Fees & Taxes</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gratuity</Text>
              <Text style={styles.summaryValue}>Client-Discretionary</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>${ride.price.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Legal Small Print */}
        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>Conditions of Carriage</Text>
          <Text style={styles.legalText}>
            Luna Limo operates as a luxury private hire service. All bookings are subject to our standard terms of service. 
            Cancellations made within 24 hours of scheduled pickup may be subject to full fare charges. Total fare includes all tolls and standard executive fees.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing the gold standard in executive transportation.
          </Text>
          <Text style={styles.footerBranding}>LUNA LIMO WORLDWIDE</Text>
          <View style={styles.signatureContainer}>
             <Text>Electronically Processed and Authenticated</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
