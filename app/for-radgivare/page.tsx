'use client';

import { farms } from "@/src/data/dummyData";
import FarmsTable from "@/components/FarmsTable";
import { useState } from "react";
import { Info } from "lucide-react";
import { ChevronDown } from "lucide-react";

export default function RadgivarePage() {
  const total = farms.length;
  const green = farms.filter((f) => f.status === "green").length;
  const yellow = farms.filter((f) => f.status === "yellow").length;
  const red = farms.filter((f) => f.status === "red").length;
  const atRisk = yellow + red;

  // State för globala checklist-moduler (placeholder)
  const [enabled, setEnabled] = useState({
    miljocompliance: true,
    krav: false,
    avfall: false,
    godsel: true,
    skyddszoner: true,
    vaxtskydd: false,
    kemikalie: false,
    nitrat: false,
    mejeri: false,
    djurmarkning: false,
    djurvalfard: false,
    haccp: false,
    salmonella: false,
    crosscompliance: true,
    ecoschemes: false,
    koldmedia: false,
    vatten: false,
    brandskydd: false,
  });

  const toggle = (key: keyof typeof enabled) => {
    setEnabled(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
    );
  };

  const groups = [
    {
      title: 'Grundmiljö & tillsyn',
      items: [
        { key: 'miljocompliance', label: 'Miljöcompliance & tillsynsunderlag' },
        { key: 'avfall', label: 'Avfallshantering' },
        { key: 'godsel', label: 'Gödseljournaler' },
        { key: 'skyddszoner', label: 'Skyddszoner & GAEC' },
        { key: 'vaxtskydd', label: 'Växtskyddsjournal' },
        { key: 'kemikalie', label: 'Kemikaliehantering' },
        { key: 'nitrat', label: 'Nitratdirektivet / kvävebalans' },
      ],
    },
    {
      title: 'Djur & livsmedel',
      items: [
        { key: 'mejeri', label: 'Mejeri-kontroller' },
        { key: 'djurmarkning', label: 'Djurmarkning' },
        { key: 'djurvalfard', label: 'Djurvälfärd & djurskydd' },
        { key: 'haccp', label: 'Livsmedelssäkerhet (HACCP)' },
        { key: 'salmonella', label: 'Salmonella' },
      ],
    },
    {
      title: 'CAP & stöd',
      items: [
        { key: 'krav', label: 'KRAV-kontroller' },
        { key: 'crosscompliance', label: 'Cross-compliance (SMR + GAEC)' },
        { key: 'ecoschemes', label: 'Eco-schemes' },
      ],
    },
    {
      title: 'Teknik & övrigt',
      items: [
        { key: 'koldmedia', label: 'Köldmedia (F-gas)' },
        { key: 'vatten', label: 'Vatten & dricksvatten' },
        { key: 'brandskydd', label: 'Brandskydd' },
      ],
    },
  ];

  return (
    <div className="space-y-8 p-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-green-800"> {/* Grön header */}
          Välkommen till AgriReg – Rådgivarvy
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Portföljvy för miljöplaner, tillsynsunderlag och CAP-optimering.
        </p>
      </section>

      {/* Stats-rutor */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Totalt antal gårdar</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Gröna gårdar</p>
          <p className="text-3xl font-bold text-green-600">{green}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Gula gårdar</p>
          <p className="text-3xl font-bold text-yellow-600">{yellow}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Röda gårdar</p>
          <p className="text-3xl font-bold text-red-600">{red}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Gårdar i risk</p>
          <p className="text-3xl font-bold text-orange-600">{atRisk}</p>
        </div>
      </div>

      {/* Exklusiva rådgivarfunktioner – placeholder */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-8 mb-12 border border-green-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Exklusiva funktioner för rådgivare</h2>
        <p className="text-gray-700 mb-6">
          Som rådgivare äger du risken och har full kontroll – lås underlag, signera och export till Länsstyrelsen.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow">
            <p className="text-lg font-medium text-gray-800 mb-2">Låsa tillsynsunderlag</p>
            <p className="text-sm text-gray-500">Förhindra ändringar efter granskning</p>
            <button className="mt-4 px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
              Kommande funktion
            </button>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow">
            <p className="text-lg font-medium text-gray-800 mb-2">Signera / godkänna</p>
            <p className="text-sm text-gray-500">Digital signatur för ansvar</p>
            <button className="mt-4 px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
              Kommande funktion
            </button>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow">
            <p className="text-lg font-medium text-gray-800 mb-2">Export till Länsstyrelsen</p>
            <p className="text-sm text-gray-500">Format för inlämning</p>
            <button className="mt-4 px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
              Kommande funktion
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-8 text-center">
          (Placeholder i demo – aktiveras vid betalning)
        </p>
      </div>

      {/* Globala checklist-moduler (din accordion-kod – kompakt) */}
      {/* ... din befintliga accordion-sektion här ... */}

      <section>
        <h2 className="text-2xl font-semibold mb-4">Dina gårdar</h2>
        <p className="text-gray-600 mb-6">
          Klicka på en rad för att öppna gårdsprofilen (där du kan överskrida globala moduler).
        </p>
        <FarmsTable />
      </section>
    </div>
  );
}