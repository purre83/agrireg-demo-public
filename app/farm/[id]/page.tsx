"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getFarmById } from "@/src/data/dummyData";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TillsynDownloadButton } from "@/components/tillsyn-report";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState } from "react";

export default function FarmPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const farm = getFarmById(params.id);

  if (!farm) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Gården kunde inte hittas.{" "}
          <button
            className="underline text-blue-600"
            onClick={() => router.push("/")}
          >
            Tillbaka till dashboard
          </button>
        </p>
      </div>
    );
  }

  const statusColor =
    farm.status === "green"
      ? "bg-green-100 text-green-800"
      : farm.status === "yellow"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  const completedChecklist = 9;
  const totalChecklist = 12;
  const completionPct = Math.round((completedChecklist / totalChecklist) * 100);

  const capPct = Math.round(
    (farm.currentSupport / farm.potentialSupport) * 100
  );
  const outnyttjat = farm.potentialSupport - farm.currentSupport;

  // Placeholder-state för valbara checklist-moduler
  const [enabled, setEnabled] = useState({
    miljocompliance: true,
    skyddszoner: true,
    godsel: true,
    krav: false,
    mejeri: false,
    koldmedia: false,
    avfall: false,
    djurmarkning: false,
  });

  const toggle = (key: keyof typeof enabled) => {
    setEnabled(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const groups = [
    {
      title: 'Grundmiljö & tillsyn',
      items: [
        { key: 'miljocompliance', label: 'Miljöcompliance & tillsynsunderlag' },
        { key: 'skyddszoner', label: 'Skyddszoner & GAEC' },
        { key: 'godsel', label: 'Gödseljournaler' },
      ],
    },
    {
      title: 'Certifiering & specialkontroller',
      items: [
        { key: 'krav', label: 'KRAV-kontroller' },
        { key: 'mejeri', label: 'Mejeri-kontroller' },
      ],
    },
    {
      title: 'Övriga kontroller',
      items: [
        { key: 'koldmedia', label: 'Köldmedia' },
        { key: 'avfall', label: 'Avfallshantering' },
        { key: 'djurmarkning', label: 'Djurmarkning' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500">
        <Link href="/" className="hover:underline">
          Dashboard
        </Link>{" "}
        / <span className="text-gray-700">{farm.name}</span>
      </nav>

      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{farm.name}</h1>
          <p className="text-sm text-gray-600">
            {farm.owner} • {farm.area} ha • {farm.type} • {farm.region}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Senast uppdaterad i AgriReg: {farm.lastUpdated}
          </p>
        </div>
        <Badge className={statusColor}>
          {farm.status === "green"
            ? "Grön – låg risk"
            : farm.status === "yellow"
            ? "Gul – viss risk"
            : "Röd – hög risk"}
        </Badge>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="miljo">Miljöplan & tillsyn</TabsTrigger>
          <TabsTrigger value="cap">CAP-optimering</TabsTrigger>
          <TabsTrigger value="moduler">Moduler & checklistor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <p className="text-sm text-gray-700 mb-4">
            Översikt över gårdens status. Använd flikarna för att gå djupare i
            miljöplan/tillsyn respektive CAP-optimering.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-1">
                Miljö & tillsyn
              </h2>
              <p className="text-sm text-gray-600">
                {completionPct}% av checklistan uppfylld inför nästa tillsyn.
                Nästa deadline:{" "}
                <span className="font-medium">
                  {farm.nextDeadline ?? "Ingen registrerad deadline"}
                </span>
                .
              </p>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-1">
                CAP-stöd
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Nuvarande stöd:{" "}
                <span className="font-medium">
                  {farm.currentSupport.toLocaleString("sv-SE")} kr
                </span>{" "}
                • Möjligt stöd:{" "}
                <span className="font-medium">
                  {farm.potentialSupport.toLocaleString("sv-SE")} kr
                </span>
              </p>
              <Progress value={capPct} />
              <p className="mt-1 text-xs text-gray-500">
                {capPct}% av möjligt stöd utnyttjat.{" "}
                {outnyttjat > 0 && (
                  <span>
                    Cirka{" "}
                    <span className="font-semibold">
                      {outnyttjat.toLocaleString("sv-SE")} kr
                    </span>{" "}
                    bedöms outnyttjat.
                  </span>
                )}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="miljo">
          <p className="text-sm text-gray-700 mb-4">
            Samlad bild av miljöplan, tillsynsstatus och centrala dokument.
            Underlaget är strukturerat enligt Länsstyrelsens logik men bygger
            på demodata.
          </p>

          {/* Status panel */}
          <div className="mb-4 rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Status inför tillsyn
                </h2>
                <p className="text-sm text-gray-600">
                  {completionPct}% av checklistan är markerad som uppfylld.{" "}
                  {farm.status === "green"
                    ? "Fokus på finjusteringar och dokumentation."
                    : farm.status === "yellow"
                    ? "Viss risk – prioritera kompletteringar före nästa kontroll."
                    : "Hög risk – flera centrala underlag behöver åtgärdas."}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {completedChecklist}/{totalChecklist}
                </p>
                <p className="text-xs text-gray-500">checkpunkter uppfyllda</p>
              </div>
            </div>
          </div>

          {/* Checklist + documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Checklista miljöplan & tillsyn
              </h3>
              <ul className="space-y-1">
                {[
                  ["Gödselhanteringsplan 2025", true],
                  ["Spridningsjournal växtnäring", true],
                  ["Skyddszoner kartlagda", true],
                  ["Nitratjournal uppdaterad", false],
                  ["Kemikalieförteckning signerad", true],
                  ["Växtskyddsjournal komplett", false],
                  ["Blockkarta uppdaterad", true],
                  ["Djurhållningsrutiner dokumenterade", true],
                  ["Spridningsrestriktioner kontrollerade", true],
                  ["Avvikelserapportering dokumenterad", false],
                  ["Egenkontrollrutiner uppdaterade", true],
                  ["Senaste tillsynsprotokoll bifogat", false],
                ].map(([label, done], idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm border"
                  >
                    <span>{label}</span>
                    <span
                      className={
                        done
                          ? "rounded-full bg-green-100 text-xs px-2 py-0.5 text-green-800"
                          : "rounded-full bg-yellow-100 text-xs px-2 py-0.5 text-yellow-800"
                      }
                    >
                      {done ? "✓ Klar" : "⚠ Saknas"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Dokument i AgriReg (demo)
                </h3>
                <ul className="space-y-1 text-sm">
                  {[
                    ["Miljöplan 2025 – huvuddokument", "2025-10-01"],
                    ["Gödselhanteringsplan 2025", "2025-09-15"],
                    ["Spridningsjournal 2024/2025", "2025-11-05"],
                    ["Växtskyddsjournal 2024/2025", "2025-10-28"],
                    ["Kartunderlag block & skyddszoner", "2025-09-20"],
                  ].map(([name, date], idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between rounded-md bg-white px-3 py-2 border"
                    >
                      <span>{name}</span>
                      <span className="text-xs text-gray-500">{date}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <TillsynDownloadButton farm={farm} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cap">
          <p className="text-sm text-gray-700 mb-4">
            Här visas en förenklad demobild av hur AgriReg kan synliggöra
            outnyttjat CAP-stöd per gård och föreslå åtgärdspaket. Beloppen är
            exempel och bygger på demodata.
          </p>

          <div className="rounded-xl border bg-white p-4 shadow-sm mb-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Outnyttjat stöd 2025 (demo)
            </h2>
            <p className="text-2xl font-bold text-green-800">
              {outnyttjat.toLocaleString("sv-SE")} kr
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Baserat på antaganden om eco-schemes, GAEC och gårdens
              produktionsinriktning.
            </p>

            <div className="mt-4">
              <Progress value={capPct} />
              <p className="mt-1 text-xs text-gray-500">
                Nuvarande nivå: {capPct}% av möjligt stöd.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "1. Fånggröda på 40 ha",
                effect: "+14 200 kr",
                text: "Inför fånggröda på utvalda spannmålsfält med låg erosionsrisk.",
              },
              {
                title: "2. Skyddszon längs vattendrag",
                effect: "+9 800 kr",
                text: "Bredda skyddszoner längs känsliga vattendrag enligt eco-scheme.",
              },
              {
                title: "3. Kombinerat eco-scheme 4 + 5",
                effect: "+21 000 kr (netto)",
                text: "Paketlösning med ersättning för mångfaldsyta och långsiktig vall.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border bg-white p-4 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{item.text}</p>
                </div>
                <p className="mt-3 text-sm font-semibold text-green-800">
                  {item.effect}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              CAP-optimeringsmotorn är under utveckling. Den fulla versionen
              kommer kunna ta hänsyn till blockdata, djurhållning, växtföljd,
              eco-schemes och nationella tillägg.
            </p>
            <p className="mt-2 font-medium">
              Vill du vara rådgivare i första användargruppen?
              Kontakta oss via knappen i toppen.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="moduler">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Aktivera checklistor för denna gård</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-3 h-6 w-6 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4 bg-gray-800 text-white rounded-lg">
                    <p>Välj vilka kontroller som ska ingå i checklistor och tillsynsunderlag. Full version anpassar PDF och påminnelser automatiskt.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <p className="text-gray-600 mb-8">
              Aktivera moduler per gård – systemet uppdaterar checklista och PDF-underlag därefter.
            </p>

            <div className="space-y-10">
              {groups.map(group => (
                <div key={group.title}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{group.title}</h3>
                  <div className="space-y-4">
                    {group.items.map(item => (
                      <div key={item.key} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <span className="text-lg text-gray-900 font-medium">{item.label}</span>
                        <Switch
                          checked={enabled[item.key as keyof typeof enabled]}
                          onCheckedChange={() => toggle(item.key as keyof typeof enabled)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-8 text-center">
              (Demo-placeholder – valen sparas lokalt. Full version sparar per gård och uppdaterar automatiskt)
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}