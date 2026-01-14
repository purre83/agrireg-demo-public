'use client';

import { farms } from "@/src/data/dummyData";
import FarmsTable from "@/components/FarmsTable";
import { useState } from 'react';

export default function RadgivarePage() {
  const total = farms.length;
  const green = farms.filter((f) => f.status === "green").length;
  const yellow = farms.filter((f) => f.status === "yellow").length;
  const red = farms.filter((f) => f.status === "red").length;
  const atRisk = yellow + red; // Gårdar i risk = gul + röd

  // Placeholder-state för valbara checklistor
  const [selectedChecklists, setSelectedChecklists] = useState<string[]>([
    'miljocompliance', // Default på
  ]);

  const checklists = [
    { id: 'miljocompliance', label: 'Miljöcompliance & tillsyn (grund)' },
    { id: 'krav', label: 'KRAV-kontroller' },
    { id: 'mejeri', label: 'Mejeri-kontroller' },
    { id: 'koldmedia', label: 'Köldmedia' },
    { id: 'avfall', label: 'Avfallshantering' },
    { id: 'djurmarkning', label: 'Djurmarkning' },
    { id: 'skyddszoner', label: 'Skyddszoner & GAEC' },
    { id: 'godsel', label: 'Gödseljournaler' },
  ];

  const toggleChecklist = (id: string) => {
    setSelectedChecklists(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

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

      {/* Valbara checklistor – placeholder för KRAV etc. */}
      <section className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Aktivera checklistor (kommande funktion)</h2>
        <p className="text-gray-600 mb-6">
          Kryssa i vilka kontroller du vill aktivera per gård (t.ex. KRAV, mejeri, köldmedia). Full version anpassar checklistor och tillsynsunderlag automatiskt.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {checklists.map((checklist) => (
            <label key={checklist.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedChecklists.includes(checklist.id)}
                onChange={() => toggleChecklist(checklist.id)}
                className="w-6 h-6 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-lg">{checklist.label}</span>
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-6">
          (Placeholder i demon – valen sparas lokalt. Full version sparar per gård/globalt)
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Dina gårdar</h2>
        <p className="text-gray-600 mb-6">
          Klicka på en rad för att öppna gårdsprofilen.
        </p>
        <FarmsTable />
      </section>
    </div>
  );
}