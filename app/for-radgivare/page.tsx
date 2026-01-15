'use client';

import { farms } from "@/src/data/dummyData";
import FarmsTable from "@/components/FarmsTable";
import { useState } from "react";
import { Info } from "lucide-react";
import { ChevronDown } from "lucide-react"; // För accordion-pil

export default function RadgivarePage() {
  const total = farms.length;
  const green = farms.filter((f) => f.status === "green").length;
  const yellow = farms.filter((f) => f.status === "yellow").length;
  const red = farms.filter((f) => f.status === "red").length;
  const atRisk = yellow + red;

  // State för globala checklist-moduler
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

  // State för öppna accordion-grupper
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
        <h1 className="text-4xl font-bold tracking-tight text-blue-800">
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

      {/* Kompakt global checklist-sektion med custom accordion */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Globala checklist-moduler (standard för nya gårdar)</h2>
          <div className="relative group ml-3">
            <Info className="h-5 w-5 text-gray-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
              Standardval för nya gårdar. Full version tillåter globala inställningar + per-gård-överskridning.
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Aktivera moduler som standard för nya gårdar. Per gård kan du överskrida i gårdsprofilen.
        </p>

        <div className="space-y-2">
          {groups.map(group => {
            const activeCount = group.items.filter(item => enabled[item.key as keyof typeof enabled]).length;
            const isOpen = openGroups.includes(group.title);

            return (
              <div key={group.title} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-900">{group.title}</span>
                    <span className="ml-3 text-sm text-gray-500">({activeCount}/{group.items.length} aktiverade)</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-3 gap-4">
                    {group.items.map(item => (
                      <div key={item.key} className="flex items-center justify-between">
                        <span className="text-base text-gray-900">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enabled[item.key as keyof typeof enabled]}
                            onChange={() => toggle(item.key as keyof typeof enabled)}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
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