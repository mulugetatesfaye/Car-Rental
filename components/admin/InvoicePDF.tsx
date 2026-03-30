import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Doc } from "@/convex/_generated/dataModel";

/*
Font.register({
  family: "PlayfairDisplay",
  src: "https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvL-7_Wvese6dfjaMjGRUpd86B-VV9SDRmS7-J.ttf",
  fontStyle: "italic",
  fontWeight: "bold",
});
*/

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    borderBottom : "1px solid #eeeeee",
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: "column",
  },
  logo: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#C6A87C", // Gold color from Luna Limo theme
    fontStyle: "italic",
    textTransform: "uppercase",
  },
  tagline: {
    fontSize: 8,
    color: "#666666",
    letterSpacing: 2,
    marginTop: 2,
    textTransform: "uppercase",
  },
  invoiceTitle: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "bold",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#666666",
    textAlign: "right",
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    color: "#C6A87C",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 8,
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    flexDirection: "column",
    width: "45%",
  },
  label: {
    fontSize: 8,
    color: "#999999",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: "#000000",
    fontWeight: "bold",
  },
  table: {
    marginTop: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderBottom: "1px solid #eeeeee",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1px solid #f0f0f0",
  },
  tableCellDescription: {
    flex: 3,
    fontSize: 10,
  },
  tableCellAmount: {
    flex: 1,
    fontSize: 10,
    textAlign: "right",
    fontWeight: "bold",
  },
  totalSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: "#666666",
    marginRight: 20,
  },
  totalValue: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "bold",
    width: 80,
    textAlign: "right",
  },
  grandTotal: {
    fontSize: 16,
    color: "#C6A87C",
    fontWeight: "bold",
    width: 100,
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: "1px solid #eeeeee",
    paddingTop: 10,
    textAlign: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#999999",
  },
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

  const invoiceNumber = `INV-${ride._id.slice(-6).toUpperCase()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Luna Limo</Text>
            <Text style={styles.tagline}>Executive Chauffeur Service</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>OFFICIAL INVOICE</Text>
            <Text style={styles.invoiceNumber}>Date: {formattedDate}</Text>
            <Text style={styles.invoiceNumber}>Invoice #: {invoiceNumber}</Text>
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={styles.label}>Service Provider</Text>
            <Text style={styles.value}>{settings?.companyName || "Luna Limo Executive"}</Text>
            <Text style={{ fontSize: 9, color: "#666", marginTop: 4 }}>
              {settings?.address || "123 Executive Drive, Suite 100"}
            </Text>
            <Text style={{ fontSize: 9, color: "#666" }}>
              {settings?.email || "concierge@lunalimo.com"}
            </Text>
            <Text style={{ fontSize: 9, color: "#666" }}>
              {settings?.phone || "+1 (555) 000-0000"}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>To</Text>
            <Text style={styles.label}>Client Name</Text>
            <Text style={styles.value}>{ride.customerName}</Text>
            <Text style={{ fontSize: 9, color: "#666", marginTop: 4 }}>
              {ride.customerEmail}
            </Text>
            <Text style={{ fontSize: 9, color: "#666" }}>
              {ride.customerPhone || "Not provided"}
            </Text>
          </View>
        </View>

        {/* Journey Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Journey Summary</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Date & Time</Text>
              <Text style={styles.value}>{ride.pickupDate} at {ride.pickupTime || "TBD"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Vehicle Class</Text>
              <Text style={styles.value}>{ride.carTypeName}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Distance</Text>
              <Text style={styles.value}>{ride.distance.toFixed(1)} miles</Text>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Route</Text>
            <Text style={{ fontSize: 9, color: "#333", marginBottom: 2 }}>
              FROM: {ride.pickupAddress}
            </Text>
            <Text style={{ fontSize: 9, color: "#333" }}>
              TO: {ride.destinationAddress}
            </Text>
          </View>
        </View>

        {/* Table/Billing */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellDescription}>Description</Text>
            <Text style={styles.tableCellAmount}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellDescription}>
              Executive Transportation Service ({ride.carTypeName})
            </Text>
            <Text style={styles.tableCellAmount}>${ride.price.toFixed(2)}</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${ride.price.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (0%)</Text>
            <Text style={styles.totalValue}>$0.00</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 10, paddingTop: 10, borderTop: "1px solid #eeeeee" }]}>
            <Text style={[styles.totalLabel, { fontWeight: "bold", color: "#000" }]}>GRAND TOTAL</Text>
            <Text style={styles.grandTotal}>${ride.price.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing Luna Limo Executive Service.
          </Text>
          <Text style={[styles.footerText, { marginTop: 4 }]}>
            This is an automated invoice. Paid via digital transaction.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
