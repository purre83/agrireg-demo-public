'use client';

import { useSearchParams } from 'next/navigation';
import { farms } from "@/src/data/dummyData";
import Link from 'next/link';
import { Upload, FileText, Lock } from 'lucide-react';
import { useState } from 'react';

export default function LantbrukarePage() {
  const searchParams = useSearchParams();
  const pilotId = searchParams.get('pilot');

  const pilotFarm = farms.find(f => f.id === 'harparboda' && f.isPilot);

  // Om ?pilot=harparboda – visa personlig pilot-vy
  if (pilotId === 'harparboda' && pilotFarm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Personlig välkomst */}
          <div className="bg-green-100 p-8 rounded-xl mb-12 text-center shadow-md">
            <h1 className="text-4xl font-bold mb-4">Välkommen till din pilot, Harparboda Gård!</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Här får du en egen vy för att testa AgriReg i praktiken. Allt är bara för din egen kontroll – inget myndighetsdokument.
            </p>
          </div>

          {/* Vad ska göras – och när (brutal tydlighet först) */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Vad ska göras – och när
            </h2>

            <div className="space-y-8">
              {/* Nästa åtgärd */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2">Nästa åtgärd</h3>
                <p className="text-2xl font-medium text-red-700">
                  {pilotFarm.nextAction || "Ingen akut åtgärd just nu – bra jobbat!"}
                </p>
              </div>

              {/* Kommande krav */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Kommande krav att ha koll på</h3>
                <ul className="space-y-3 text-lg">
                  {(pilotFarm.upcomingRequirements || []).map((req, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3 text-yellow-600">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
                {(!pilotFarm.upcomingRequirements || pilotFarm.upcomingRequirements.length === 0) && (
                  <p className="text-gray-600">Inga kommande krav just nu – du ligger bra till!</p>
                )}
              </div>

              {/* Ofta glömda saker */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Saker som lätt glöms bort</h3>
                <ul className="space-y-3 text-lg">
                  {(pilotFarm.forgottenCommon || []).map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3 text-amber-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Aktiva checklistor */}
          <h2 className="text-3xl font-bold text-center mb-8">Dina aktiva checklistor</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {pilotFarm.activeModules.map((module) => (
              <div key={module} className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {module === "egenkontroll-miljo" && "Egenkontroll – miljö (bas)"}
                  {module === "djurhallning-notkreatur" && "Djurhållning – nötkreatur"}
                  {module === "journaler-dokumentation" && "Journaler & dokumentation"}
                  {module === "tillsyn-sam" && "Tillsyn & SAM-relaterade krav"}
                </h3>
                <p className="text-gray-600 mb-4">
                  Status: Lugn läge – klicka för att se detaljer (kommer snart i piloten).
                </p>
                <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium">
                  Öppna checklista (placeholder)
                </button>
              </div>
            ))}
          </div>

          {/* Låsta moduler längst ner */}
          <div className="bg-gray-100 rounded-xl shadow p-8 mb-12 border border-gray-300">
            <div className="flex items-center mb-6 justify-center">
              <Lock className="h-8 w-8 text-gray-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">KRAV / certifiering / mejeri</h3>
            </div>
            <p className="text-center text-gray-700 mb-6 max-w-2xl mx-auto">
              Dessa moduler är inte aktiverade i piloten. De kräver rådgivare för kvalitetssäkring, signering och full export.
            </p>
            <div className="text-center">
              <a
                href="mailto:pilot@agrireg.se?subject=Pilot Harparboda – aktivera KRAV/mejeri"
                className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition shadow"
              >
                Kontakta rådgivare för att aktivera
              </a>
            </div>
          </div>

          {/* Tydlig disclaimer */}
          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <p className="text-lg font-medium text-blue-900">
              Det här är en pilot – bara för din egen kontroll och lugn.<br />
              <strong>Ingen färdig tillsynsrapport • Ingen export • Ingen sign-off</strong><br />
              Allt är ej inskickbart underlag.
            </p>
          </div>

          {/* Länk tillbaka */}
          <div className="text-center mt-12">
            <Link href="/" className="text-primary font-semibold underline">
              Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Annars – vanlig demo-vy (din befintliga kod)
  const exampleFarm = farms[0];

  const bondStatusColor = exampleFarm.status === 'green' ? 'bg-green-600 text-white' : 
                          exampleFarm.status === 'yellow' ? 'bg-yellow-600 text-white' : 
                          'bg-red-600 text-white';

  const statusText = exampleFarm.status === 'green' ? 'Grön – allt under kontroll' : 
                     exampleFarm.status === 'yellow' ? 'Gul – viss risk' : 
                     'Röd – hög risk';

  const unusedSupport = 18400;

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [showHelpForm, setShowHelpForm] = useState(false);

  return (
    // Din befintliga demo-vy här (kopiera från din kod – jag kortar för plats)
    <div className="min-h-screen bg-gray-50 py-12">
      {/* ... hela din befintliga demo-vy ... */}
    </div>
  );
}