'use client';

import { farms } from "@/src/data/dummyData";
import FarmsTable from "@/components/FarmsTable";
import { useState } from "react";
import { Info } from "lucide-react";

export default function RadgivarePage() {
  const total = farms.length;
  const green = farms.filter((f) => f.status === "green").length;
  const yellow = farms.filter((f) => f.status === "yellow").length;
  const red = farms.filter((f) => f.status === "red").length;
  const atRisk = yellow + red;

  // Placeholder-state för globala checklist-moduler
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
        <h1 className="text-4xl font-bold tracking-tight text-blue-800">
          Välkommen till AgriReg – Rådgivarvy
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Portföljvy för miljöplaner, tillsynsunderlag och CAP-optimering.
        </p>
      </section>

      {/* Stats-rutor – exakt som din skärmdump */}
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

      {/* Globala checklist-moduler – placeholder */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Globala checklist-moduler (standard för nya gårdar)</h2>
          <div className="relative group ml-3">
            <Info className="h-6 w-6 text-gray-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
              Standardval för nya gårdar. Full version tillåter globala inställningar + per-gård-överskridning.
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-8">
          Aktivera moduler som standard för nya gårdar. Per gård kan du överskrida i gårdsprofilen.
        </p>

        <div className="space-y-10">
          {groups.map(group => (
            <div key={group.title}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{group.title}</h3>
              <div className="space-y-4">
                {group.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <span className="text-lg text-gray-900 font-medium">{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled[item.key as keyof typeof enabled]}
                        onChange={() => toggle(item.key as keyof typeof enabled)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-8 text-center">
          (Demo-placeholder – valen sparas lokalt. Full version sparar globalt + per gård)
        </p>
      </div>

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