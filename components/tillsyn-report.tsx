"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { FileText } from "lucide-react";
import type { Farm } from "@/src/data/dummyData";
import { Button } from "@/components/ui/button";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 700,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 700,
  },
  fieldValue: {
    fontSize: 11,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  bulletItem: {
    fontSize: 11,
    marginBottom: 4,
  },
});

function TillsynDocument({ farm }: { farm: Farm }) {
  const statusText =
    farm.status === "green"
      ? "Grön – låg risk inför tillsyn."
      : farm.status === "yellow"
      ? "Gul – viss risk, ett antal kompletteringar rekommenderas."
      : "Röd – hög risk. Flera centrala underlag behöver åtgärdas innan tillsyn.";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Tillsynsunderlag – {farm.name}</Text>

        <View>
          <Text style={styles.fieldLabel}>Gård</Text>
          <Text style={styles.fieldValue}>{farm.name}</Text>

          <Text style={styles.fieldLabel}>Ägare</Text>
          <Text style={styles.fieldValue}>{farm.owner}</Text>

          <Text style={styles.fieldLabel}>Region</Text>
          <Text style={styles.fieldValue}>{farm.region}</Text>

          <Text style={styles.fieldLabel}>Areal</Text>
          <Text style={styles.fieldValue}>{farm.area} ha</Text>

          <Text style={styles.fieldLabel}>Senast uppdaterad i AgriReg</Text>
          <Text style={styles.fieldValue}>{farm.lastUpdated}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Sammanfattning av status</Text>
        <Text style={{ fontSize: 11, marginBottom: 6 }}>{statusText}</Text>
        <Text style={{ fontSize: 11 }}>
          Detta underlag är framtaget i AgriReg – ett system för miljökrav och
          CAP-stöd för svenska lantbruk. Underlaget sammanfattar kända
          dokument, checklistor och rekommenderade fokusområden inför kommande
          tillsyn från Länsstyrelsen eller annan myndighet.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>
          Översikt – checklista miljöplan & tillsyn
        </Text>

        {[
          "Gödselhanteringsplan 2025",
          "Spridningsjournal växtnäring",
          "Skyddszoner och känsliga områden",
          "Nitratjournal och växtnäringsbalans",
          "Kemikalieförteckning och lagring",
          "Journalföring av växtskyddsmedel",
        ].map((item, idx) => (
          <Text key={idx} style={styles.bulletItem}>
            • {item}
          </Text>
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Rekommenderade fokusområden</Text>
        <Text style={styles.bulletItem}>
          • Säkerställ att samtliga journaler är signerade för aktuell period.
        </Text>
        <Text style={styles.bulletItem}>
          • Gå igenom skyddszoner längs vattendrag och uppdatera kartunderlag.
        </Text>
        <Text style={styles.bulletItem}>
          • Dokumentera eventuella ändringar i djurhållning och gödselstrategi.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Dokumentförteckning (exempel)</Text>
        {[
          "Miljöplan 2025 – huvuddokument",
          "Gödselhanteringsplan 2025",
          "Spridningsjournal växtnäring 2024/2025",
          "Växtskyddsjournal 2024/2025",
          "Kartunderlag – block, skyddszoner, känsliga områden",
        ].map((doc, idx) => (
          <Text key={idx} style={styles.bulletItem}>
            • {doc}
          </Text>
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Bilageförteckning</Text>
        <Text style={styles.bulletItem}>
          • Bilaga 1 – Blockkarta med markerade skyddszoner
        </Text>
        <Text style={styles.bulletItem}>
          • Bilaga 2 – Spridningsjournal med markering av känsliga perioder
        </Text>
        <Text style={styles.bulletItem}>
          • Bilaga 3 – Sammanställning av journalförda växtskyddsmedel
        </Text>
      </Page>
    </Document>
  );
}

export function TillsynDownloadButton({ farm }: { farm: Farm }) {
  return (
    <div className="space-y-2">
      <PDFDownloadLink
        document={<TillsynDocument farm={farm} />}
        fileName={`Tillsynsunderlag-${farm.name.replace(/\s+/g, "-")}.pdf`}
      >
        {({ loading }) => (
          <Button
            className="inline-flex items-center gap-2"
            type="button"
            disabled={loading}
          >
            <FileText className="h-4 w-4" />
            {loading ? "Genererar PDF…" : "Generera tillsynsunderlag (PDF)"}
          </Button>
        )}
      </PDFDownloadLink>
      <p className="text-xs text-gray-500 max-w-md">
        PDF:en är ett exempelunderlag anpassat för tillsyn från Länsstyrelsen.
        Innehållet bygger på demodata och ska endast användas i demo-syfte.
      </p>
    </div>
  );
}
